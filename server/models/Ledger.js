const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true, unique: true },
  type:       { type: String, enum: ['asset', 'liability', 'income', 'expense'], required: true },
  isDefault:  { type: Boolean, default: false },
  balance:    { type: Number, default: 0 }, // running balance (debit positive)
  description:{ type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Ledger', ledgerSchema);
