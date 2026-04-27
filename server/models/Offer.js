const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    discount:    { type: String, default: '' },   // e.g. "20%" or "₹500 off"
    badge:       { type: String, default: '' },   // e.g. "Today Only", "Flash Sale"
    link:        { type: String, default: '' },   // optional CTA link
    startDate:   { type: Date, required: true },
    endDate:     { type: Date, required: true },
    status:      { type: String, enum: ['active', 'inactive', 'expired'], default: 'active' },
    priority:    { type: Number, default: 0 },    // higher = shown first when multiple active
  },
  { timestamps: true }
);

// Auto-expire: virtual to check if currently valid
offerSchema.virtual('isLive').get(function () {
  const now = new Date();
  return this.status === 'active' && this.startDate <= now && this.endDate >= now;
});

module.exports = mongoose.model('Offer', offerSchema);
