const WorkGallery = require('../models/WorkGallery');
const { deleteCloudinaryImage } = require('../middleware/upload');

exports.list = async (_req, res) => {
  try {
    const items = await WorkGallery.find({ visible: true }).sort({ order: 1, createdAt: -1 }).lean();
    res.json({ items });
  } catch (e) { res.status(500).json({ message: 'Failed' }); }
};

exports.adminList = async (_req, res) => {
  try {
    const items = await WorkGallery.find().sort({ order: 1, createdAt: -1 }).lean();
    res.json({ items });
  } catch (e) { res.status(500).json({ message: 'Failed' }); }
};

exports.create = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Image required' });
    const { title, description, category, visible, order } = req.body;
    if (!title) return res.status(400).json({ message: 'Title required' });
    const item = await WorkGallery.create({
      title,
      description: description || '',
      category:    category    || '',
      image:       req.file.path,   // Cloudinary URL
      visible:     visible !== 'false',
      order:       Number(order) || 0,
    });
    res.status(201).json({ item });
  } catch (e) { res.status(500).json({ message: 'Failed' }); }
};

exports.update = async (req, res) => {
  try {
    const item = await WorkGallery.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    const { title, description, category, visible, order } = req.body;
    if (title       !== undefined) item.title       = title;
    if (description !== undefined) item.description = description;
    if (category    !== undefined) item.category    = category;
    if (visible     !== undefined) item.visible     = visible !== 'false' && visible !== false;
    if (order       !== undefined) item.order       = Number(order);
    if (req.file) {
      await deleteCloudinaryImage(item.image);
      item.image = req.file.path;
    }
    await item.save();
    res.json({ item });
  } catch (e) { res.status(500).json({ message: 'Failed' }); }
};

exports.remove = async (req, res) => {
  try {
    const item = await WorkGallery.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    await deleteCloudinaryImage(item.image);
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ message: 'Failed' }); }
};
