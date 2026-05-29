const Order = require('../models/Order');
const Product = require('../models/Product');
const ServiceRequest = require('../models/ServiceRequest');

exports.dashboard = async (_req, res) => {
  try {
    const User = require('../models/User');
    const now = new Date();
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const [revenueAgg, orderCount, activeServices, customerCount, monthlyOrders, monthlyServices] = await Promise.all([
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.countDocuments(),
      ServiceRequest.countDocuments({ status: { $ne: 'completed' } }),
      User.countDocuments({ role: 'user' }),
      // Monthly revenue last 12 months
      Order.aggregate([
        { $match: { createdAt: { $gte: twelveMonthsAgo }, status: { $ne: 'cancelled' } } },
        { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, revenue: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
      // Monthly service count last 12 months
      ServiceRequest.aggregate([
        { $match: { createdAt: { $gte: twelveMonthsAgo } } },
        { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
    ]);

    // Build 12-month arrays
    const months = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
      return { year: d.getFullYear(), month: d.getMonth() + 1, label: d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }) };
    });

    const salesChart = months.map(m => {
      const found = monthlyOrders.find(o => o._id.year === m.year && o._id.month === m.month);
      return { label: m.label, revenue: found?.revenue || 0, orders: found?.count || 0 };
    });

    const serviceChart = months.map(m => {
      const found = monthlyServices.find(s => s._id.year === m.year && s._id.month === m.month);
      return { label: m.label, count: found?.count || 0 };
    });

    res.json({
      revenue: revenueAgg[0]?.total || 0,
      orders: orderCount,
      activeServiceRequests: activeServices,
      customers: customerCount,
      salesChart,
      serviceChart,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Stats failed' });
  }
};

exports.products = {
  create: async (req, res) => {
    try {
      const body = req.body;
      let extra = [];
      if (body.images) {
        try {
          extra = typeof body.images === 'string' ? JSON.parse(body.images) : body.images;
        } catch {
          extra = [];
        }
      }
      const images = req.files?.length
        ? req.files.map((f) => f.path)   // Cloudinary URL
        : Array.isArray(extra)
          ? extra
          : [];

      const product = await Product.create({
        name: body.name,
        description: body.description || '',
        category: body.category,
        brand: body.brand || 'Coldtech',
        images,
        costPrice: Number(body.costPrice),
        sellingPrice: Number(body.sellingPrice),
        stock: Number(body.stock),
        discount: Number(body.discount || 0),
        featured: body.featured === 'true' || body.featured === true,
        popularity: Number(body.popularity || 0),
      });
      res.status(201).json({ product });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Create product failed' });
    }
  },

  update: async (req, res) => {
    try {
      const body = req.body;
      const update = {
        name: body.name,
        description: body.description,
        category: body.category,
        brand: body.brand,
        costPrice: body.costPrice != null ? Number(body.costPrice) : undefined,
        sellingPrice: body.sellingPrice != null ? Number(body.sellingPrice) : undefined,
        stock: body.stock != null ? Number(body.stock) : undefined,
        discount: body.discount != null ? Number(body.discount) : undefined,
        featured: body.featured === 'true' || body.featured === true,
        popularity: body.popularity != null ? Number(body.popularity) : undefined,
      };
      if (req.files?.length) {
        update.images = req.files.map((f) => f.path);   // Cloudinary URLs
      }
      Object.keys(update).forEach((k) => update[k] === undefined && delete update[k]);

      const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
      if (!product) return res.status(404).json({ message: 'Product not found' });
      res.json({ product });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Update failed' });
    }
  },

  remove: async (req, res) => {
    try {
      const p = await Product.findByIdAndDelete(req.params.id);
      if (!p) return res.status(404).json({ message: 'Product not found' });
      res.json({ ok: true });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Delete failed' });
    }
  },

  patchStock: async (req, res) => {
    try {
      const { stock } = req.body;
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        { stock: Number(stock) },
        { new: true }
      );
      if (!product) return res.status(404).json({ message: 'Product not found' });
      res.json({ product });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Stock update failed' });
    }
  },
};

exports.orders = {
  list: async (_req, res) => {
    try {
      const orders = await Order.find()
        .sort({ createdAt: -1 })
        .populate('user', 'name email')
        .populate('products.product', 'name images')
        .lean();
      res.json({ orders });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Failed to load orders' });
    }
  },

  updateStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
      if (!order) return res.status(404).json({ message: 'Order not found' });
      res.json({ order });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Update failed' });
    }
  },
};

exports.services = {
  list: async (_req, res) => {
    try {
      const requests = await ServiceRequest.find()
        .sort({ createdAt: -1 })
        .populate('assignedTo', 'name email')
        .lean();
      res.json({ requests });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Failed to load service requests' });
    }
  },

  update: async (req, res) => {
    try {
      const { status, notes, estimatedCompletion } = req.body;
      const update = {};
      if (status) update.status = status;
      if (notes !== undefined) update.notes = notes;
      if (estimatedCompletion) update.estimatedCompletion = new Date(estimatedCompletion);

      const ticket = await ServiceRequest.findByIdAndUpdate(req.params.id, update, { new: true });
      if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
      res.json({ ticket });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Update failed' });
    }
  },

  assign: async (req, res) => {
    try {
      const { staffId } = req.body;
      const User = require('../models/User');
      if (staffId) {
        const staff = await User.findOne({ _id: staffId, role: 'staff' });
        if (!staff) return res.status(404).json({ message: 'Staff not found' });
      }
      const ticket = await ServiceRequest.findByIdAndUpdate(
        req.params.id,
        { assignedTo: staffId || null },
        { new: true }
      ).populate('assignedTo', 'name email');
      if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
      res.json({ ticket });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Assign failed' });
    }
  },
};

const User = require('../models/User');

exports.customers = {
  list: async (req, res) => {
    try {
      const page  = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(50, parseInt(req.query.limit) || 20);
      const q     = req.query.search || '';
      const filter = { role: 'user' };
      if (q) filter.$or = [{ name: new RegExp(q, 'i') }, { email: new RegExp(q, 'i') }];

      const [users, total] = await Promise.all([
        User.find(filter).select('-password').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
        User.countDocuments(filter),
      ]);

      // Attach order + service counts
      const enriched = await Promise.all(users.map(async u => {
        const [orderCount, serviceCount, revenueAgg] = await Promise.all([
          Order.countDocuments({ user: u._id }),
          ServiceRequest.countDocuments({ user: u._id }),
          Order.aggregate([
            { $match: { user: u._id, status: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } },
          ]),
        ]);
        return { ...u, orderCount, serviceCount, totalSpent: revenueAgg[0]?.total || 0 };
      }));

      res.json({ customers: enriched, total, pages: Math.ceil(total / limit) || 1 });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Failed to load customers' });
    }
  },

  profile: async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select('-password').lean();
      if (!user) return res.status(404).json({ message: 'Customer not found' });

      const [orders, services] = await Promise.all([
        Order.find({ user: req.params.id }).sort({ createdAt: -1 }).populate('products.product', 'name images').lean(),
        ServiceRequest.find({ user: req.params.id }).sort({ createdAt: -1 }).lean(),
      ]);

      res.json({ customer: user, orders, services });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Failed to load profile' });
    }
  },
};
