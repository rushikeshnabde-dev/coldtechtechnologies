const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: '' },
  quantity:    { type: Number, required: true, min: 0, default: 1 },
  rate:        { type: Number, required: true, min: 0, default: 0 },
  taxPercent:  { type: Number, default: 0 },   // per-item GST %
  taxAmount:   { type: Number, default: 0 },
  amount:      { type: Number, default: 0 },   // qty * rate (before tax)
  total:       { type: Number, default: 0 },   // amount + taxAmount
}, { _id: false });

const invoiceSchema = new mongoose.Schema({
  invoiceNumber:  { type: String, unique: true },
  invoiceDate:    { type: Date, default: Date.now },
  dueDate:        { type: Date },

  /* Company (sender) */
  company: {
    name:    { type: String, default: 'Coldtech Technologies' },
    address: { type: String, default: 'PCMC, Pune, Maharashtra 410507' },
    phone:   { type: String, default: '+91 9529882920' },
    email:   { type: String, default: 'support@coldtechtechnologies.in' },
    gstin:   { type: String, default: '' },
    logo:    { type: String, default: '' },
  },

  /* Client (receiver) */
  client: {
    name:    { type: String, required: true, trim: true },
    email:   { type: String, trim: true, default: '' },
    phone:   { type: String, trim: true, default: '' },
    address: { type: String, trim: true, default: '' },
    gstin:   { type: String, default: '' },
  },

  items:         { type: [itemSchema], default: [] },
  subtotal:      { type: Number, default: 0 },
  taxTotal:      { type: Number, default: 0 },
  discount:      { type: Number, default: 0 },
  grandTotal:    { type: Number, default: 0 },

  currency:      { type: String, default: 'INR' },
  status:        { type: String, enum: ['draft','sent','paid','cancelled'], default: 'draft' },
  notes:         { type: String, default: '' },
  paymentTerms:  { type: String, default: 'Payment due within 15 days' },
  templateId:    { type: mongoose.Schema.Types.ObjectId, ref: 'InvoiceTemplate', default: null },
  createdBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

invoiceSchema.pre('save', async function () {
  if (!this.invoiceNumber) {
    const year  = new Date().getFullYear();
    const count = await mongoose.model('Invoice').countDocuments();
    this.invoiceNumber = `INV-${year}-${String(count + 1).padStart(4, '0')}`;
  }
});

module.exports = mongoose.model('Invoice', invoiceSchema);
