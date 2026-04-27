const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  customerName: { type: String, required: true, trim: true },
  location:     { type: String, default: '' },
  review:       { type: String, required: true },
  image:        { type: String, default: '' },
  visible:      { type: Boolean, default: true },
  order:        { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
