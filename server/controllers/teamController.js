const TeamMember = require('../models/TeamMember');
const { deleteCloudinaryImage } = require('../middleware/upload');

const parseSkills = v =>
  v ? (Array.isArray(v) ? v : v.split(',').map(s => s.trim()).filter(Boolean)) : [];

exports.list = async (_req, res) => {
  try {
    const members = await TeamMember.find({ visible: true }).sort({ order: 1, createdAt: 1 }).lean();
    res.json({ members });
  } catch (e) { res.status(500).json({ message: 'Failed' }); }
};

exports.adminList = async (_req, res) => {
  try {
    const members = await TeamMember.find().sort({ order: 1, createdAt: 1 }).lean();
    res.json({ members });
  } catch (e) { res.status(500).json({ message: 'Failed' }); }
};

exports.create = async (req, res) => {
  try {
    const { name, role, bio, experience, skills, certifications, linkedin, location, featured, visible, order } = req.body;
    if (!name || !role) return res.status(400).json({ message: 'Name and role required' });

    const files = req.files || {};
    // Cloudinary: req.file.path = secure URL
    const profileImg = files.image?.[0]?.path || '';
    const workImgs   = (files.workImages || []).map(f => f.path);

    const member = await TeamMember.create({
      name, role,
      bio:            bio || '',
      experience:     experience || '',
      skills:         parseSkills(skills),
      certifications: certifications || '',
      linkedin:       linkedin || '',
      location:       location || '',
      image:          profileImg,
      workImages:     workImgs,
      featured:       featured === 'true' || featured === true,
      visible:        visible !== 'false',
      order:          Number(order) || 0,
    });
    res.status(201).json({ member });
  } catch (e) { console.error(e); res.status(500).json({ message: 'Failed' }); }
};

exports.update = async (req, res) => {
  try {
    const m = await TeamMember.findById(req.params.id);
    if (!m) return res.status(404).json({ message: 'Not found' });

    const { name, role, bio, experience, skills, certifications, linkedin, location, featured, visible, order } = req.body;
    if (name           !== undefined) m.name           = name;
    if (role           !== undefined) m.role           = role;
    if (bio            !== undefined) m.bio            = bio;
    if (experience     !== undefined) m.experience     = experience;
    if (skills         !== undefined) m.skills         = parseSkills(skills);
    if (certifications !== undefined) m.certifications = certifications;
    if (linkedin       !== undefined) m.linkedin       = linkedin;
    if (location       !== undefined) m.location       = location;
    if (featured       !== undefined) m.featured       = featured === 'true' || featured === true;
    if (visible        !== undefined) m.visible        = visible !== 'false' && visible !== false;
    if (order          !== undefined) m.order          = Number(order);

    const files = req.files || {};
    if (files.image?.[0]) {
      await deleteCloudinaryImage(m.image); // delete old from Cloudinary
      m.image = files.image[0].path;        // store new Cloudinary URL
    }
    if (files.workImages?.length) {
      await Promise.all(m.workImages.map(deleteCloudinaryImage));
      m.workImages = files.workImages.map(f => f.path);
    }

    await m.save();
    res.json({ member: m });
  } catch (e) { console.error(e); res.status(500).json({ message: 'Failed' }); }
};

exports.remove = async (req, res) => {
  try {
    const m = await TeamMember.findByIdAndDelete(req.params.id);
    if (!m) return res.status(404).json({ message: 'Not found' });
    await deleteCloudinaryImage(m.image);
    await Promise.all((m.workImages || []).map(deleteCloudinaryImage));
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ message: 'Failed' }); }
};
