const Offer = require('../models/Offer');

/* ── Public: today's active offer ── */
exports.today = async (_req, res) => {
  try {
    const now = new Date();
    const offer = await Offer.findOne({
      status: 'active',
      startDate: { $lte: now },
      endDate:   { $gte: now },
    }).sort({ priority: -1, createdAt: -1 }).lean();

    if (!offer) return res.json({ offer: null });
    res.json({ offer });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to load offer' });
  }
};

/* ── Admin: list all offers ── */
exports.list = async (_req, res) => {
  try {
    const now = new Date();
    // Auto-mark expired offers
    await Offer.updateMany(
      { status: 'active', endDate: { $lt: now } },
      { $set: { status: 'expired' } }
    );
    const offers = await Offer.find().sort({ createdAt: -1 }).lean();
    res.json({ offers });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to load offers' });
  }
};

/* ── Admin: create offer ── */
exports.create = async (req, res) => {
  try {
    const { title, description, discount, badge, link, startDate, endDate, status, priority } = req.body;
    if (!title || !startDate || !endDate) {
      return res.status(400).json({ message: 'Title, startDate and endDate are required' });
    }
    const offer = await Offer.create({
      title, description, discount, badge, link,
      startDate: new Date(startDate),
      endDate:   new Date(endDate),
      status:    status || 'active',
      priority:  Number(priority) || 0,
    });
    res.status(201).json({ offer });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Create offer failed' });
  }
};

/* ── Admin: update offer ── */
exports.update = async (req, res) => {
  try {
    const { title, description, discount, badge, link, startDate, endDate, status, priority } = req.body;
    const update = {};
    if (title       !== undefined) update.title       = title;
    if (description !== undefined) update.description = description;
    if (discount    !== undefined) update.discount    = discount;
    if (badge       !== undefined) update.badge       = badge;
    if (link        !== undefined) update.link        = link;
    if (startDate   !== undefined) update.startDate   = new Date(startDate);
    if (endDate     !== undefined) update.endDate     = new Date(endDate);
    if (status      !== undefined) update.status      = status;
    if (priority    !== undefined) update.priority    = Number(priority);

    const offer = await Offer.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!offer) return res.status(404).json({ message: 'Offer not found' });
    res.json({ offer });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Update failed' });
  }
};

/* ── Admin: delete offer ── */
exports.remove = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);
    if (!offer) return res.status(404).json({ message: 'Offer not found' });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Delete failed' });
  }
};

/* ── Admin: toggle status ── */
exports.toggle = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: 'Offer not found' });
    offer.status = offer.status === 'active' ? 'inactive' : 'active';
    await offer.save();
    res.json({ offer });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Toggle failed' });
  }
};
