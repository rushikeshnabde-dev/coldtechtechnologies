const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Order = require('../models/Order');

/* ── Staff CRUD (admin only) ── */
exports.list = async (_req, res) => {
  try {
    const staff = await User.find({ role: 'staff' }).select('-password').sort({ createdAt: -1 }).lean();
    res.json({ staff });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to load staff' });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password required' });
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: 'Email already in use' });
    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email: email.toLowerCase(), password: hashed, role: 'staff' });
    res.status(201).json({ staff: { _id: user._id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Create staff failed' });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const update = {};
    if (name) update.name = name;
    if (email) update.email = email.toLowerCase();
    if (password) update.password = await bcrypt.hash(password, 12);
    const user = await User.findOneAndUpdate({ _id: req.params.id, role: 'staff' }, update, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'Staff not found' });
    res.json({ staff: user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Update failed' });
  }
};

exports.remove = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id, role: 'staff' });
    if (!user) return res.status(404).json({ message: 'Staff not found' });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Delete failed' });
  }
};

/* ── Assign order to staff (admin only) ── */
exports.assignOrder = async (req, res) => {
  try {
    const { staffId } = req.body;
    const staff = await User.findOne({ _id: staffId, role: 'staff' });
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    const order = await Order.findByIdAndUpdate(req.params.orderId, { assignedTo: staffId }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ order });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Assign failed' });
  }
};

/* ── Staff dashboard: own assigned orders ── */
exports.myOrders = async (req, res) => {
  try {
    const orders = await Order.find({ assignedTo: req.user._id })
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate('products.product', 'name images')
      .lean();
    res.json({ orders });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to load orders' });
  }
};

/* ── Staff updates order status ── */
exports.updateMyOrder = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOne({ _id: req.params.orderId, assignedTo: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found or not assigned to you' });
    order.status = status;
    if (status === 'delivered') order.completedAt = new Date();
    await order.save();
    res.json({ order });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Update failed' });
  }
};

/* ── Admin: staff performance stats ── */
exports.performance = async (_req, res) => {
  try {
    const staff = await User.find({ role: 'staff' }).select('-password').lean();
    const results = await Promise.all(staff.map(async s => {
      const [completed, pending, avgAgg] = await Promise.all([
        Order.countDocuments({ assignedTo: s._id, status: 'delivered' }),
        Order.countDocuments({ assignedTo: s._id, status: { $nin: ['delivered', 'cancelled'] } }),
        Order.aggregate([
          { $match: { assignedTo: s._id, completedAt: { $ne: null } } },
          { $project: { diff: { $subtract: ['$completedAt', '$createdAt'] } } },
          { $group: { _id: null, avg: { $avg: '$diff' } } },
        ]),
      ]);
      const avgMs = avgAgg[0]?.avg || 0;
      const avgHours = Math.round(avgMs / 3600000);
      return { _id: s._id, name: s.name, email: s.email, completed, pending, avgHours };
    }));
    res.json({ performance: results });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Performance stats failed' });
  }
};
