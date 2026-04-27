const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title:     { type: String, required: true, trim: true },
    slug:      { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt:   { type: String, default: '' },          // short summary shown on listing
    content:   { type: String, required: true },        // full HTML/markdown body
    coverImage:{ type: String, default: '' },           // URL
    category:  { type: String, default: 'General' },
    tags:      [{ type: String }],
    author:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    published: { type: Boolean, default: false },
    views:     { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-generate slug from title if not provided
blogSchema.pre('validate', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  }
  next();
});

module.exports = mongoose.model('Blog', blogSchema);
