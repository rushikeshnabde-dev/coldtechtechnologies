const mongoose = require('mongoose');

// Each double-entry posting creates TWO transaction documents (debit + credit)
// grouped by a shared voucherRef
const transactionSchema = new mongoose.Schema({
  date:        { type: Date, required: true, default: Date.now },
  ledgerId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Ledger', required: true },
  type:        { type: String, enum: ['debit', 'credit'], required: true },
  amount:      { type: Number, required: true, min: 0 },
  narration:   { type: String, default: '' },
  // Reference to source document
  referenceId:   { type: mongoose.Schema.Types.ObjectId },
  referenceType: { type: String, enum: ['invoice', 'payment', 'journal'], default: 'journal' },
  // Groups the debit + credit pair(s) of a single voucher
  voucherRef:  { type: String, required: true },
}, { timestamps: true });

transactionSchema.index({ ledgerId: 1, date: 1 });
transactionSchema.index({ voucherRef: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
