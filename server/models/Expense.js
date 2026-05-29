const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  type:        { type: String, enum: ['inward', 'outward'], required: true },
  category:    { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: '' },
  amount:      { type: Number, required: true, min: 0 },
  date:        { type: Date, required: true, default: Date.now },
  reference:   { type: String, trim: true, default: '' },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status:      { type: String, enum: ['pending', 'paid', 'cancelled'], default: 'paid' },
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
