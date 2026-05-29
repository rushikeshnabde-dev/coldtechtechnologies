const Testimonial = require('../models/Testimonial');
const { deleteCloudinaryImage } = require('../middleware/upload');

exports.list = async (_req, res) => {
  try {
    const testimonials = await Testimonial.find({ visible: true }).sort({ order: 1, createdAt: -1 }).lean();
    res.json({ testimonials });
  } catch (e) { res.status(500).json({ message: 'Failed' }); }
};

exports.adminList = async (_req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ order: 1, createdAt: -1 }).lean();
    res.json({ testimonials });
  } catch (e) { res.status(500).json({ message: 'Failed' }); }
};

exports.create = async (req, res) => {
  try {
    const { customerName, location, review, visible, order } = req.body;
    if (!customerName || !review) return res.status(400).json({ message: 'Name and review required' });
    const t = await Testimonial.create({
      customerName, review,
      location: location || '',
      image:    req.file?.path || '',   // Cloudinary URL
      visible:  visible !== 'false',
      order:    Number(order) || 0,
    });
    res.status(201).json({ testimonial: t });
  } catch (e) { res.status(500).json({ message: 'Failed' }); }
};

exports.update = async (req, res) => {
  try {
    const t = await Testimonial.findById(req.params.id);
    if (!t) return res.status(404).json({ message: 'Not found' });
    const { customerName, location, review, visible, order } = req.body;
    if (customerName !== undefined) t.customerName = customerName;
    if (location     !== undefined) t.location     = location;
    if (review       !== undefined) t.review       = review;
    if (visible      !== undefined) t.visible      = visible !== 'false' && visible !== false;
    if (order        !== undefined) t.order        = Number(order);
    if (req.file) {
      await deleteCloudinaryImage(t.image);
      t.image = req.file.path;
    }
    await t.save();
    res.json({ testimonial: t });
  } catch (e) { res.status(500).json({ message: 'Failed' }); }
};

exports.remove = async (req, res) => {
  try {
    const t = await Testimonial.findByIdAndDelete(req.params.id);
    if (!t) return res.status(404).json({ message: 'Not found' });
    await deleteCloudinaryImage(t.image);
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ message: 'Failed' }); }
};
