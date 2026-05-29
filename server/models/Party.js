const mongoose = require('mongoose');

const partySchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  phone:   { type: String, trim: true, default: '' },
  email:   { type: String, trim: true, default: '' },
  address: { type: String, trim: true, default: '' },
  gstin:   { type: String, trim: true, default: '' },
  type:    { type: String, enum: ['customer', 'vendor'], default: 'customer' },
  // Each party gets a linked ledger account
  ledgerId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Ledger', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Party', partySchema);
