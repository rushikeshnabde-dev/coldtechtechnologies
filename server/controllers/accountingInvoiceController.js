const AccountingInvoice = require('../models/AccountingInvoice');
const Party             = require('../models/Party');
const Ledger            = require('../models/Ledger');
const { postVoucher, reverseVoucher } = require('../utils/accountingEngine');

/** Calculate line items and totals */
function calcInvoice(items, gstType) {
  let subtotal = 0, totalCgst = 0, totalSgst = 0, totalIgst = 0;

  const processed = items.map(item => {
    const taxable = Number(item.qty || 0) * Number(item.rate || 0);
    const gst     = taxable * (Number(item.gstPercent || 0) / 100);
    let cgst = 0, sgst = 0, igst = 0;
    if (gstType === 'inter') {
      igst = gst;
    } else {
      cgst = gst / 2;
      sgst = gst / 2;
    }
    const lineTotal = taxable + gst;
    subtotal   += taxable;
    totalCgst  += cgst;
    totalSgst  += sgst;
    totalIgst  += igst;
    return { ...item, taxableAmount: taxable, cgst, sgst, igst, lineTotal };
  });

  const totalTax   = totalCgst + totalSgst + totalIgst;
  const grandTotal = subtotal + totalTax;
  return { processed, subtotal, totalCgst, totalSgst, totalIgst, totalTax, grandTotal };
}

exports.list = async (req, res) => {
  const { status, search, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;

  let partyIds;
  if (search) {
    const parties = await Party.find({ name: { $regex: search, $options: 'i' } }).select('_id');
    partyIds = parties.map(p => p._id);
    filter.$or = [
      { invoiceNumber: { $regex: search, $options: 'i' } },
      { partyId: { $in: partyIds } },
    ];
  }

  const skip  = (Number(page) - 1) * Number(limit);
  const total = await AccountingInvoice.countDocuments(filter);
  const invoices = await AccountingInvoice.find(filter)
    .populate('partyId', 'name phone email type')
    .sort({ date: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.json({ invoices, total, pages: Math.ceil(total / Number(limit)) });
};

exports.get = async (req, res) => {
  const invoice = await AccountingInvoice.findById(req.params.id)
    .populate('partyId', 'name phone email address gstin type');
  if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
  res.json({ invoice });
};

exports.create = async (req, res) => {
  const { partyId, date, dueDate, gstType = 'intra', items, notes, company, status = 'draft' } = req.body;

  if (!partyId) return res.status(400).json({ message: 'partyId is required' });
  if (!items?.length) return res.status(400).json({ message: 'At least one item is required' });

  const party = await Party.findById(partyId);
  if (!party) return res.status(404).json({ message: 'Party not found' });

  const { processed, subtotal, totalCgst, totalSgst, totalIgst, totalTax, grandTotal } =
    calcInvoice(items, gstType);

  const invoice = await AccountingInvoice.create({
    partyId, date, dueDate, gstType,
    items: processed,
    subtotal, totalCgst, totalSgst, totalIgst, totalTax, grandTotal,
    balance: grandTotal,
    notes, company, status,
    createdBy: req.user?._id,
  });

  // Post accounting entries only when status is 'posted'
  if (status === 'posted') {
    await _postInvoiceEntries(invoice, party);
  }

  res.status(201).json({ invoice });
};

exports.update = async (req, res) => {
  const { partyId, date, dueDate, gstType = 'intra', items, notes, company, status } = req.body;

  const invoice = await AccountingInvoice.findById(req.params.id);
  if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
  if (invoice.status === 'cancelled') return res.status(400).json({ message: 'Cannot edit a cancelled invoice' });

  const wasPosted = invoice.status === 'posted';
  const willPost  = status === 'posted';

  const party = await Party.findById(partyId || invoice.partyId);
  if (!party) return res.status(404).json({ message: 'Party not found' });

  const { processed, subtotal, totalCgst, totalSgst, totalIgst, totalTax, grandTotal } =
    calcInvoice(items || invoice.items, gstType);

  // If was posted and being re-edited, reverse old entries first
  if (wasPosted && invoice.voucherRef) {
    await reverseVoucher({
      originalVoucherRef: invoice.voucherRef,
      narration: `Reversal for edit of ${invoice.invoiceNumber}`,
      referenceId: invoice._id,
      referenceType: 'invoice',
    });
    invoice.voucherRef = undefined;
  }

  Object.assign(invoice, {
    partyId: partyId || invoice.partyId,
    date: date || invoice.date,
    dueDate: dueDate || invoice.dueDate,
    gstType, items: processed,
    subtotal, totalCgst, totalSgst, totalIgst, totalTax, grandTotal,
    balance: grandTotal - invoice.amountPaid,
    notes: notes ?? invoice.notes,
    company: company || invoice.company,
    status: status || invoice.status,
  });

  if (willPost && !wasPosted) {
    await _postInvoiceEntries(invoice, party);
  }

  await invoice.save();
  res.json({ invoice });
};

exports.cancel = async (req, res) => {
  const invoice = await AccountingInvoice.findById(req.params.id);
  if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
  if (invoice.status === 'cancelled') return res.status(400).json({ message: 'Already cancelled' });

  if (invoice.voucherRef) {
    await reverseVoucher({
      originalVoucherRef: invoice.voucherRef,
      narration: `Cancellation of ${invoice.invoiceNumber}`,
      referenceId: invoice._id,
      referenceType: 'invoice',
    });
  }

  invoice.status = 'cancelled';
  await invoice.save();
  res.json({ invoice });
};

exports.remove = async (req, res) => {
  const invoice = await AccountingInvoice.findById(req.params.id);
  if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
  if (invoice.status === 'posted') return res.status(400).json({ message: 'Cancel the invoice before deleting' });
  await invoice.deleteOne();
  res.json({ message: 'Deleted' });
};

/** Internal: post double-entry for a sales invoice */
async function _postInvoiceEntries(invoice, party) {
  const entries = [];

  // Debit: Customer/Party ledger (receivable)
  entries.push({ ledgerId: party.ledgerId, type: 'debit', amount: invoice.grandTotal });

  // Credit: Sales ledger
  const salesLedger = await Ledger.findOne({ name: 'Sales' });
  if (!salesLedger) throw new Error('Sales ledger not found. Run /api/accounting/ledgers/seed first.');
  entries.push({ ledgerId: salesLedger._id, type: 'credit', amount: invoice.subtotal });

  // Credit: CGST
  if (invoice.totalCgst > 0) {
    const cgstLedger = await Ledger.findOne({ name: 'CGST' });
    if (cgstLedger) entries.push({ ledgerId: cgstLedger._id, type: 'credit', amount: invoice.totalCgst });
  }

  // Credit: SGST
  if (invoice.totalSgst > 0) {
    const sgstLedger = await Ledger.findOne({ name: 'SGST' });
    if (sgstLedger) entries.push({ ledgerId: sgstLedger._id, type: 'credit', amount: invoice.totalSgst });
  }

  // Credit: IGST
  if (invoice.totalIgst > 0) {
    const igstLedger = await Ledger.findOne({ name: 'IGST' });
    if (igstLedger) entries.push({ ledgerId: igstLedger._id, type: 'credit', amount: invoice.totalIgst });
  }

  const voucherRef = await postVoucher({
    entries,
    narration: `Sales Invoice ${invoice.invoiceNumber}`,
    referenceId:   invoice._id,
    referenceType: 'invoice',
    date: invoice.date,
  });

  invoice.voucherRef = voucherRef;
  invoice.status     = 'posted';
}
