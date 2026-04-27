const Payment           = require('../models/Payment');
const AccountingInvoice = require('../models/AccountingInvoice');
const Party             = require('../models/Party');
const Ledger            = require('../models/Ledger');
const { postVoucher, reverseVoucher } = require('../utils/accountingEngine');

exports.list = async (req, res) => {
  const { invoiceId, partyId, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (invoiceId) filter.invoiceId = invoiceId;
  if (partyId)   filter.partyId   = partyId;
  const skip  = (Number(page) - 1) * Number(limit);
  const total = await Payment.countDocuments(filter);
  const payments = await Payment.find(filter)
    .populate('invoiceId', 'invoiceNumber grandTotal')
    .populate('partyId',   'name')
    .populate('accountLedgerId', 'name')
    .sort({ date: -1 })
    .skip(skip)
    .limit(Number(limit));
  res.json({ payments, total, pages: Math.ceil(total / Number(limit)) });
};

exports.get = async (req, res) => {
  const payment = await Payment.findById(req.params.id)
    .populate('invoiceId')
    .populate('partyId')
    .populate('accountLedgerId');
  if (!payment) return res.status(404).json({ message: 'Payment not found' });
  res.json({ payment });
};

exports.create = async (req, res) => {
  const { invoiceId, amount, mode = 'cash', notes, date } = req.body;

  if (!invoiceId || !amount) return res.status(400).json({ message: 'invoiceId and amount are required' });

  const invoice = await AccountingInvoice.findById(invoiceId);
  if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
  if (invoice.status === 'cancelled') return res.status(400).json({ message: 'Invoice is cancelled' });
  if (invoice.status === 'draft') return res.status(400).json({ message: 'Post the invoice before recording payment' });

  const party = await Party.findById(invoice.partyId);
  if (!party) return res.status(404).json({ message: 'Party not found' });

  // Determine account ledger (Cash or Bank)
  const accountLedgerName = mode === 'bank' || mode === 'upi' || mode === 'cheque' ? 'Bank' : 'Cash';
  const accountLedger = await Ledger.findOne({ name: accountLedgerName });
  if (!accountLedger) return res.status(400).json({ message: `${accountLedgerName} ledger not found` });

  const payAmt = Math.min(Number(amount), invoice.balance);
  if (payAmt <= 0) return res.status(400).json({ message: 'Invoice already fully paid' });

  // Double-entry: Debit Cash/Bank, Credit Customer
  const voucherRef = await postVoucher({
    entries: [
      { ledgerId: accountLedger._id,  type: 'debit',  amount: payAmt },
      { ledgerId: party.ledgerId,     type: 'credit', amount: payAmt },
    ],
    narration:     `Payment received for ${invoice.invoiceNumber}`,
    referenceId:   invoice._id,
    referenceType: 'payment',
    date:          date ? new Date(date) : new Date(),
  });

  const payment = await Payment.create({
    invoiceId,
    partyId:         party._id,
    amount:          payAmt,
    mode,
    accountLedgerId: accountLedger._id,
    notes,
    voucherRef,
    date: date ? new Date(date) : new Date(),
  });

  // Update invoice balance
  invoice.amountPaid += payAmt;
  invoice.balance     = invoice.grandTotal - invoice.amountPaid;
  invoice.status      = invoice.balance <= 0 ? 'paid' : 'partial';
  await invoice.save();

  res.status(201).json({ payment });
};

exports.remove = async (req, res) => {
  const payment = await Payment.findById(req.params.id);
  if (!payment) return res.status(404).json({ message: 'Payment not found' });

  // Reverse accounting entries
  if (payment.voucherRef) {
    await reverseVoucher({
      originalVoucherRef: payment.voucherRef,
      narration: `Reversal of payment ${payment.paymentNumber}`,
      referenceId:   payment._id,
      referenceType: 'payment',
    });
  }

  // Restore invoice balance
  const invoice = await AccountingInvoice.findById(payment.invoiceId);
  if (invoice) {
    invoice.amountPaid = Math.max(0, invoice.amountPaid - payment.amount);
    invoice.balance    = invoice.grandTotal - invoice.amountPaid;
    invoice.status     = invoice.balance <= 0 ? 'paid' : invoice.amountPaid > 0 ? 'partial' : 'posted';
    await invoice.save();
  }

  await payment.deleteOne();
  res.json({ message: 'Payment reversed and deleted' });
};
