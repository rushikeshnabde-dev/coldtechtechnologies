const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  isDefault: { type: Boolean, default: false },
  html:      { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('InvoiceTemplate', templateSchema);
