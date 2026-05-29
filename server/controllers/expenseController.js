const Expense = require('../models/Expense');

/* ── List all expenses (with optional filters) ── */
exports.list = async (req, res) => {
  try {
    const { type, from, to, status } = req.query;
    const filter = {};
    if (type)   filter.type   = type;
    if (status) filter.status = status;
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to)   filter.date.$lte = new Date(to);
    }
    const expenses = await Expense.find(filter)
      .populate('createdBy', 'name email')
      .sort({ date: -1, createdAt: -1 })
      .lean();
    res.json({ expenses });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to load expenses' });
  }
};

/* ── Summary: total inward / outward / balance ── */
exports.summary = async (_req, res) => {
  try {
    const [inward, outward] = await Promise.all([
      Expense.aggregate([
        { $match: { type: 'inward', status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Expense.aggregate([
        { $match: { type: 'outward', status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ]);
    const totalInward  = inward[0]?.total  || 0;
    const totalOutward = outward[0]?.total || 0;
    res.json({ totalInward, totalOutward, balance: totalInward - totalOutward });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to load summary' });
  }
};

/* ── Create ── */
exports.create = async (req, res) => {
  try {
    const { type, category, description, amount, date, reference, status } = req.body;
    if (!type || !category || amount === undefined) {
      return res.status(400).json({ message: 'type, category and amount are required' });
    }
    const expense = await Expense.create({
      type, category, description, amount, reference, status,
      date: date ? new Date(date) : new Date(),
      createdBy: req.user._id,
    });
    res.status(201).json({ expense });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to create expense' });
  }
};

/* ── Update ── */
exports.update = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    const fields = ['type', 'category', 'description', 'amount', 'date', 'reference', 'status'];
    fields.forEach(f => { if (req.body[f] !== undefined) expense[f] = req.body[f]; });
    if (req.body.date) expense.date = new Date(req.body.date);
    await expense.save();
    res.json({ expense });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to update expense' });
  }
};

/* ── Delete ── */
exports.remove = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Deleted' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to delete expense' });
  }
};
