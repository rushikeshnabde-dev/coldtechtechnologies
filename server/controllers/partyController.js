const Party  = require('../models/Party');
const Ledger = require('../models/Ledger');

exports.list = async (req, res) => {
  const { type, search, page = 1, limit = 50 } = req.query;
  const filter = {};
  if (type) filter.type = type;
  if (search) filter.$or = [
    { name:  { $regex: search, $options: 'i' } },
    { email: { $regex: search, $options: 'i' } },
    { phone: { $regex: search, $options: 'i' } },
  ];
  const skip  = (Number(page) - 1) * Number(limit);
  const total = await Party.countDocuments(filter);
  const parties = await Party.find(filter).sort({ name: 1 }).skip(skip).limit(Number(limit));
  res.json({ parties, total, pages: Math.ceil(total / Number(limit)) });
};

exports.get = async (req, res) => {
  const party = await Party.findById(req.params.id).populate('ledgerId');
  if (!party) return res.status(404).json({ message: 'Party not found' });
  res.json({ party });
};

exports.create = async (req, res) => {
  const { name, phone, email, address, gstin, type } = req.body;
  if (!name) return res.status(400).json({ message: 'name is required' });

  // Create a linked ledger account for this party
  const ledger = await Ledger.create({
    name:  `${name} (${type || 'customer'})`,
    type:  'asset',   // receivable for customers
    description: `Auto-created for party: ${name}`,
  });

  const party = await Party.create({ name, phone, email, address, gstin, type, ledgerId: ledger._id });
  res.status(201).json({ party });
};

exports.update = async (req, res) => {
  const { name, phone, email, address, gstin, type } = req.body;
  const party = await Party.findByIdAndUpdate(
    req.params.id,
    { name, phone, email, address, gstin, type },
    { new: true, runValidators: true }
  );
  if (!party) return res.status(404).json({ message: 'Party not found' });
  res.json({ party });
};

exports.remove = async (req, res) => {
  const party = await Party.findById(req.params.id);
  if (!party) return res.status(404).json({ message: 'Party not found' });
  await party.deleteOne();
  res.json({ message: 'Deleted' });
};
