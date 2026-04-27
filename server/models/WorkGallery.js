const mongoose = require('mongoose');

const workGallerySchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  category:    { type: String, default: '' },
  image:       { type: String, required: true },
  visible:     { type: Boolean, default: true },
  order:       { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('WorkGallery', workGallerySchema);
