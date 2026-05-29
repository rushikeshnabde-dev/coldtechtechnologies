const Order = require('../models/Order');
const Product = require('../models/Product');

exports.create = async (req, res) => {
  try {
    const { items, address } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let totalAmount = 0;
    const products = [];

    for (const line of items) {
      const product = await Product.findById(line.productId);
      if (!product) return res.status(400).json({ message: 'Invalid product in cart' });
      if (product.stock < line.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
      const effective =
        product.discount > 0
          ? Math.round(product.sellingPrice * (1 - product.discount / 100) * 100) / 100
          : product.sellingPrice;
      const lineTotal = effective * line.quantity;
      totalAmount += lineTotal;
      products.push({
        product: product._id,
        quantity: line.quantity,
        price: effective,
        name: product.name,
      });
    }

    const order = await Order.create({
      user: req.user._id,
      products,
      totalAmount: Math.round(totalAmount * 100) / 100,
      address: address || {},
      status: 'pending',
    });

    for (const line of items) {
      await Product.findByIdAndUpdate(line.productId, { $inc: { stock: -line.quantity, popularity: line.quantity } });
    }

    res.status(201).json({ order });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Order failed' });
  }
};

exports.myOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('products.product', 'name images sellingPrice')
      .lean();
    res.json({ orders });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to load orders' });
  }
};

exports.getOne = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
      .populate('products.product')
      .lean();
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ order });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to load order' });
  }
};
