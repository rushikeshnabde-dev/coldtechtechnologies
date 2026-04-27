const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    title:       { type: String, default: '' },
    description: { type: String, default: '' },
    link:        { type: String, default: '' },
    image:       { type: String, required: true }, // stored filename
    active:      { type: Boolean, default: true },
    order:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Banner', bannerSchema);
