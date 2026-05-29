const mongoose = require('mongoose');

const accountingProductSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  price:    { type: Number, required: true, min: 0, default: 0 },
  hsnSac:   { type: String, trim: true, default: '' }, // HSN or SAC code
  gstPercent:{ type: Number, default: 18 },            // GST %
  unit:     { type: String, default: 'pcs' },
  description: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('AccountingProduct', accountingProductSchema);
