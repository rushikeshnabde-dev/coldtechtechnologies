const mongoose = require('mongoose');

const lineItemSchema = new mongoose.Schema({
  productId:   { type: mongoose.Schema.Types.ObjectId, ref: 'AccountingProduct', default: null },
  name:        { type: String, required: true, trim: true },
  hsnSac:      { type: String, default: '' },
  qty:         { type: Number, required: true, min: 0, default: 1 },
  rate:        { type: Number, required: true, min: 0, default: 0 },
  gstPercent:  { type: Number, default: 18 },
  taxableAmount: { type: Number, default: 0 }, // qty * rate
  cgst:        { type: Number, default: 0 },
  sgst:        { type: Number, default: 0 },
  igst:        { type: Number, default: 0 },
  lineTotal:   { type: Number, default: 0 },
}, { _id: false });

const accountingInvoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, unique: true },
  date:          { type: Date, default: Date.now },
  dueDate:       { type: Date },

  partyId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Party', required: true },

  // Company details snapshot
  company: {
    name:    { type: String, default: 'Coldtech Technologies' },
    address: { type: String, default: 'PCMC, Pune, Maharashtra 410507' },
    phone:   { type: String, default: '+91 9529882920' },
    email:   { type: String, default: 'support@coldtechtechnologies.in' },
    gstin:   { type: String, default: '' },
  },

  gstType:    { type: String, enum: ['intra', 'inter'], default: 'intra' }, // intra=CGST+SGST, inter=IGST
  items:      { type: [lineItemSchema], default: [] },

  subtotal:   { type: Number, default: 0 },
  totalCgst:  { type: Number, default: 0 },
  totalSgst:  { type: Number, default: 0 },
  totalIgst:  { type: Number, default: 0 },
  totalTax:   { type: Number, default: 0 },
  grandTotal: { type: Number, default: 0 },

  amountPaid: { type: Number, default: 0 },
  balance:    { type: Number, default: 0 },

  status:     { type: String, enum: ['draft', 'posted', 'paid', 'partial', 'cancelled'], default: 'draft' },
  notes:      { type: String, default: '' },

  // Accounting voucher reference (links to Transaction docs)
  voucherRef: { type: String },

  createdBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

accountingInvoiceSchema.pre('save', async function () {
  if (!this.invoiceNumber) {
    const year  = new Date().getFullYear();
    const count = await mongoose.model('AccountingInvoice').countDocuments();
    this.invoiceNumber = `AINV-${year}-${String(count + 1).padStart(4, '0')}`;
  }
});

module.exports = mongoose.model('AccountingInvoice', accountingInvoiceSchema);
