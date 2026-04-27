const AccountingProduct = require('../models/AccountingProduct');

exports.list = async (req, res) => {
  const { search } = req.query;
  const filter = search
    ? { $or: [{ name: { $regex: search, $options: 'i' } }, { hsnSac: { $regex: search, $options: 'i' } }] }
    : {};
  const products = await AccountingProduct.find(filter).sort({ name: 1 });
  res.json({ products });
};

exports.get = async (req, res) => {
  const p = await AccountingProduct.findById(req.params.id);
  if (!p) return res.status(404).json({ message: 'Product not found' });
  res.json({ product: p });
};

exports.create = async (req, res) => {
  const { name, price, hsnSac, gstPercent, unit, description } = req.body;
  if (!name) return res.status(400).json({ message: 'name is required' });
  const product = await AccountingProduct.create({ name, price, hsnSac, gstPercent, unit, description });
  res.status(201).json({ product });
};

exports.update = async (req, res) => {
  const { name, price, hsnSac, gstPercent, unit, description } = req.body;
  const product = await AccountingProduct.findByIdAndUpdate(
    req.params.id,
    { name, price, hsnSac, gstPercent, unit, description },
    { new: true, runValidators: true }
  );
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ product });
};

exports.remove = async (req, res) => {
  const product = await AccountingProduct.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  await product.deleteOne();
  res.json({ message: 'Deleted' });
};
