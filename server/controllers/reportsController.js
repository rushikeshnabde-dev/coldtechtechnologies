const Transaction       = require('../models/Transaction');
const Ledger            = require('../models/Ledger');
const AccountingInvoice = require('../models/AccountingInvoice');
const Payment           = require('../models/Payment');

/** Ledger Report: statement for a single ledger */
exports.ledgerReport = async (req, res) => {
  const { ledgerId, from, to } = req.query;
  if (!ledgerId) return res.status(400).json({ message: 'ledgerId is required' });

  const ledger = await Ledger.findById(ledgerId);
  if (!ledger) return res.status(404).json({ message: 'Ledger not found' });

  const dateFilter = {};
  if (from) dateFilter.$gte = new Date(from);
  if (to)   dateFilter.$lte = new Date(to);

  const query = { ledgerId };
  if (from || to) query.date = dateFilter;

  const txs = await Transaction.find(query).sort({ date: 1, createdAt: 1 }).lean();

  let openingBalance = 0;
  // If from date given, compute opening balance from all txs before that date
  if (from) {
    const prevTxs = await Transaction.find({ ledgerId, date: { $lt: new Date(from) } }).lean();
    openingBalance = prevTxs.reduce((s, t) => s + (t.type === 'debit' ? t.amount : -t.amount), 0);
  }

  let runningBalance = openingBalance;
  const rows = txs.map(tx => {
    runningBalance += tx.type === 'debit' ? tx.amount : -tx.amount;
    return { ...tx, runningBalance };
  });

  const totalDebit  = txs.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);
  const totalCredit = txs.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);

  res.json({ ledger, openingBalance, rows, totalDebit, totalCredit, closingBalance: runningBalance });
};

/** Profit & Loss */
exports.profitLoss = async (req, res) => {
  const { from, to } = req.query;
  const dateFilter = {};
  if (from) dateFilter.$gte = new Date(from);
  if (to)   dateFilter.$lte = new Date(to);

  const incomeLedgers  = await Ledger.find({ type: 'income' });
  const expenseLedgers = await Ledger.find({ type: 'expense' });

  const sumLedger = async (ledger) => {
    const query = { ledgerId: ledger._id };
    if (from || to) query.date = dateFilter;
    const txs = await Transaction.find(query).lean();
    // For income: credit increases, debit decreases
    return txs.reduce((s, t) => s + (t.type === 'credit' ? t.amount : -t.amount), 0);
  };

  const incomeRows  = await Promise.all(incomeLedgers.map(async l => ({ ledger: l, amount: await sumLedger(l) })));
  const expenseRows = await Promise.all(expenseLedgers.map(async l => {
    const txs = await Transaction.find({ ledgerId: l._id, ...(from || to ? { date: dateFilter } : {}) }).lean();
    // For expense: debit increases
    const amount = txs.reduce((s, t) => s + (t.type === 'debit' ? t.amount : -t.amount), 0);
    return { ledger: l, amount };
  }));

  const totalIncome  = incomeRows.reduce((s, r) => s + r.amount, 0);
  const totalExpense = expenseRows.reduce((s, r) => s + r.amount, 0);
  const netProfit    = totalIncome - totalExpense;

  res.json({ incomeRows, expenseRows, totalIncome, totalExpense, netProfit });
};

/** GST Summary */
exports.gstSummary = async (req, res) => {
  const { from, to } = req.query;
  const dateFilter = {};
  if (from) dateFilter.$gte = new Date(from);
  if (to)   dateFilter.$lte = new Date(to);

  const gstLedgers = await Ledger.find({ name: { $in: ['CGST', 'SGST', 'IGST'] } });

  const rows = await Promise.all(gstLedgers.map(async l => {
    const query = { ledgerId: l._id };
    if (from || to) query.date = dateFilter;
    const txs = await Transaction.find(query).lean();
    const collected = txs.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
    const paid      = txs.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);
    return { name: l.name, collected, paid, net: collected - paid };
  }));

  // Invoice-level breakdown
  const invoiceFilter = { status: { $in: ['posted', 'paid', 'partial'] } };
  if (from || to) invoiceFilter.date = dateFilter;
  const invoices = await AccountingInvoice.find(invoiceFilter)
    .populate('partyId', 'name gstin')
    .select('invoiceNumber date partyId subtotal totalCgst totalSgst totalIgst totalTax grandTotal')
    .sort({ date: -1 })
    .lean();

  res.json({ rows, invoices });
};

/** Dashboard summary */
exports.dashboard = async (req, res) => {
  const now   = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalInvoices, totalPayments, pendingInvoices] = await Promise.all([
    AccountingInvoice.countDocuments({ status: { $in: ['posted', 'paid', 'partial'] } }),
    Payment.countDocuments({}),
    AccountingInvoice.countDocuments({ status: { $in: ['posted', 'partial'] } }),
  ]);

  const monthInvoices = await AccountingInvoice.find({
    date: { $gte: start },
    status: { $in: ['posted', 'paid', 'partial'] },
  }).select('grandTotal amountPaid balance');

  const monthRevenue    = monthInvoices.reduce((s, i) => s + i.grandTotal, 0);
  const monthCollected  = monthInvoices.reduce((s, i) => s + i.amountPaid, 0);
  const monthOutstanding= monthInvoices.reduce((s, i) => s + i.balance, 0);

  // Cash & Bank balances
  const cashLedger = await Ledger.findOne({ name: 'Cash' });
  const bankLedger = await Ledger.findOne({ name: 'Bank' });

  res.json({
    totalInvoices, totalPayments, pendingInvoices,
    monthRevenue, monthCollected, monthOutstanding,
    cashBalance: cashLedger?.balance || 0,
    bankBalance: bankLedger?.balance || 0,
  });
};
