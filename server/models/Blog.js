const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title:           { type: String, required: true, trim: true },
    slug:            { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt:         { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    content:         { type: String, required: true },
    coverImage:      { type: String, default: '' },
    category:        { type: String, default: 'General' },
    tags:            [{ type: String }],
    author:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status:          { type: String, enum: ['draft', 'published', 'scheduled'], default: 'draft' },
    published:       { type: Boolean, default: false },
    scheduledAt:     { type: Date, default: null },
    aiGenerated:     { type: Boolean, default: false },
    aiTone:          { type: String, default: '' },
    views:           { type: Number, default: 0 },
  },
  { timestamps: true }
);

blogSchema.pre('validate', function () {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  }
  // sync published with status
  this.published = this.status === 'published';
});

module.exports = mongoose.model('Blog', blogSchema);
