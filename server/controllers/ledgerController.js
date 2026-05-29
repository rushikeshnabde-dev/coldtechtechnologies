const Ledger      = require('../models/Ledger');
const Transaction = require('../models/Transaction');
const { getLedgerStatement } = require('../utils/accountingEngine');

const DEFAULT_LEDGERS = [
  { name: 'Sales',     type: 'income',    isDefault: true },
  { name: 'Purchase',  type: 'expense',   isDefault: true },
  { name: 'Cash',      type: 'asset',     isDefault: true },
  { name: 'Bank',      type: 'asset',     isDefault: true },
  { name: 'CGST',      type: 'liability', isDefault: true },
  { name: 'SGST',      type: 'liability', isDefault: true },
  { name: 'IGST',      type: 'liability', isDefault: true },
];

/** Seed default ledgers if not present */
async function seedDefaults() {
  for (const l of DEFAULT_LEDGERS) {
    await Ledger.findOneAndUpdate({ name: l.name }, l, { upsert: true, new: true });
  }
}

exports.seed = async (_req, res) => {
  await seedDefaults();
  res.json({ message: 'Default ledgers seeded' });
};

exports.list = async (req, res) => {
  const { type } = req.query;
  const filter = type ? { type } : {};
  const ledgers = await Ledger.find(filter).sort({ type: 1, name: 1 });
  res.json({ ledgers });
};

exports.get = async (req, res) => {
  const ledger = await Ledger.findById(req.params.id);
  if (!ledger) return res.status(404).json({ message: 'Ledger not found' });
  res.json({ ledger });
};

exports.create = async (req, res) => {
  const { name, type, description } = req.body;
  if (!name || !type) return res.status(400).json({ message: 'name and type are required' });
  const ledger = await Ledger.create({ name, type, description });
  res.status(201).json({ ledger });
};

exports.update = async (req, res) => {
  const { name, type, description } = req.body;
  const ledger = await Ledger.findByIdAndUpdate(
    req.params.id,
    { name, type, description },
    { new: true, runValidators: true }
  );
  if (!ledger) return res.status(404).json({ message: 'Ledger not found' });
  res.json({ ledger });
};

exports.remove = async (req, res) => {
  const ledger = await Ledger.findById(req.params.id);
  if (!ledger) return res.status(404).json({ message: 'Ledger not found' });
  if (ledger.isDefault) return res.status(400).json({ message: 'Cannot delete a default ledger' });
  const txCount = await Transaction.countDocuments({ ledgerId: ledger._id });
  if (txCount > 0) return res.status(400).json({ message: 'Ledger has transactions, cannot delete' });
  await ledger.deleteOne();
  res.json({ message: 'Deleted' });
};

exports.statement = async (req, res) => {
  const { from, to } = req.query;
  const ledger = await Ledger.findById(req.params.id);
  if (!ledger) return res.status(404).json({ message: 'Ledger not found' });
  const rows = await getLedgerStatement(ledger._id, { from, to });
  res.json({ ledger, rows });
};
