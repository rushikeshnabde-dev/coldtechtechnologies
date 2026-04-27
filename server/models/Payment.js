const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  paymentNumber: { type: String, unique: true },
  date:          { type: Date, default: Date.now },
  invoiceId:     { type: mongoose.Schema.Types.ObjectId, ref: 'AccountingInvoice', required: true },
  partyId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Party', required: true },
  amount:        { type: Number, required: true, min: 0 },
  mode:          { type: String, enum: ['cash', 'bank', 'upi', 'cheque'], default: 'cash' },
  // Which ledger was debited (Cash or Bank)
  accountLedgerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ledger', required: true },
  notes:         { type: String, default: '' },
  voucherRef:    { type: String },
}, { timestamps: true });

paymentSchema.pre('save', async function () {
  if (!this.paymentNumber) {
    const year  = new Date().getFullYear();
    const count = await mongoose.model('Payment').countDocuments();
    this.paymentNumber = `PAY-${year}-${String(count + 1).padStart(4, '0')}`;
  }
});

module.exports = mongoose.model('Payment', paymentSchema);
