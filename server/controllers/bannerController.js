const Banner = require('../models/Banner');
const { deleteCloudinaryImage } = require('../middleware/upload');

exports.list = async (_req, res) => {
  try {
    const banners = await Banner.find({ active: true }).sort({ order: 1, createdAt: 1 }).lean();
    res.json({ banners });
  } catch (e) { res.status(500).json({ message: 'Failed to load banners' }); }
};

exports.adminList = async (_req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1, createdAt: 1 }).lean();
    res.json({ banners });
  } catch (e) { res.status(500).json({ message: 'Failed to load banners' }); }
};

exports.create = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Image is required' });
    const { title, description, link, ctaLabel, ctaStyle, order, active } = req.body;
    const banner = await Banner.create({
      title: title || '', description: description || '',
      link: link || '', ctaLabel: ctaLabel || 'Claim Offer',
      ctaStyle: ctaStyle || 'primary',
      image: req.file.path,   // Cloudinary URL
      order: Number(order) || 0, active: active !== 'false',
    });
    res.status(201).json({ banner });
  } catch (e) { console.error(e); res.status(500).json({ message: 'Failed to create banner' }); }
};

exports.update = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    const { title, description, link, ctaLabel, ctaStyle, order, active } = req.body;
    if (title       !== undefined) banner.title       = title;
    if (description !== undefined) banner.description = description;
    if (link        !== undefined) banner.link        = link;
    if (ctaLabel    !== undefined) banner.ctaLabel    = ctaLabel;
    if (ctaStyle    !== undefined) banner.ctaStyle    = ctaStyle;
    if (order       !== undefined) banner.order       = Number(order);
    if (active      !== undefined) banner.active      = active !== 'false' && active !== false;
    if (req.file) {
      await deleteCloudinaryImage(banner.image);
      banner.image = req.file.path;
    }
    await banner.save();
    res.json({ banner });
  } catch (e) { console.error(e); res.status(500).json({ message: 'Failed to update banner' }); }
};

exports.remove = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    await deleteCloudinaryImage(banner.image);
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ message: 'Failed to delete banner' }); }
};
