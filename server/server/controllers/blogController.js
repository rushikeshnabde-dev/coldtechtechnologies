const Blog = require('../models/Blog');

// ── Public ────────────────────────────────────────────────────────────────────

/** GET /api/blog — list published posts */
exports.list = async (req, res) => {
  try {
    const page     = Math.max(1, parseInt(req.query.page) || 1);
    const limit    = Math.min(20, parseInt(req.query.limit) || 9);
    const category = req.query.category || '';
    const filter   = { published: true };
    if (category) filter.category = category;

    const [posts, total] = await Promise.all([
      Blog.find(filter)
        .select('title slug excerpt coverImage category tags createdAt author views')
        .populate('author', 'name')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Blog.countDocuments(filter),
    ]);

    res.json({ posts, total, pages: Math.ceil(total / limit) || 1 });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to load posts' });
  }
};

/** GET /api/blog/:slug — single post */
exports.getBySlug = async (req, res) => {
  try {
    const post = await Blog.findOneAndUpdate(
      { slug: req.params.slug, published: true },
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'name').lean();

    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ post });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to load post' });
  }
};

// ── Admin ─────────────────────────────────────────────────────────────────────

/** GET /api/admin/blog — all posts (admin) */
exports.adminList = async (_req, res) => {
  try {
    const posts = await Blog.find()
      .select('title slug published category createdAt views author')
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .lean();
    res.json({ posts });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to load posts' });
  }
};

/** POST /api/admin/blog — create post */
exports.create = async (req, res) => {
  try {
    const { title, slug, excerpt, content, coverImage, category, tags, published } = req.body;
    if (!title || !content) return res.status(400).json({ message: 'title and content are required' });

    const post = await Blog.create({
      title, slug, excerpt, content, coverImage, category,
      tags: tags || [],
      published: published === true || published === 'true',
      author: req.user._id,
    });
    res.status(201).json({ post });
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: 'Slug already exists — use a different title' });
    console.error(e);
    res.status(500).json({ message: 'Create failed' });
  }
};

/** PUT /api/admin/blog/:id — update post */
exports.update = async (req, res) => {
  try {
    const { title, slug, excerpt, content, coverImage, category, tags, published } = req.body;
    const update = { title, slug, excerpt, content, coverImage, category, tags };
    if (published !== undefined) update.published = published === true || published === 'true';
    Object.keys(update).forEach(k => update[k] === undefined && delete update[k]);

    const post = await Blog.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ post });
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: 'Slug already exists' });
    console.error(e);
    res.status(500).json({ message: 'Update failed' });
  }
};

/** DELETE /api/admin/blog/:id */
exports.remove = async (req, res) => {
  try {
    const post = await Blog.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Delete failed' });
  }
};
