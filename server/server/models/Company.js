const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name:          { type: String, required: true, trim: true },
    contactPerson: { type: String, required: true, trim: true },
    email:         { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone:         { type: String, default: '' },
    address:       { type: String, default: '' },
    gstNumber:     { type: String, default: '' },

    // AMC Plan
    amcPlan: {
      name:      { type: String, default: '' },       // e.g. "Basic", "Premium"
      startDate: { type: Date, default: null },
      endDate:   { type: Date, default: null },
      services:  [{ type: String }],                  // included services list
      active:    { type: Boolean, default: false },
    },

    // Devices registered under this company
    devices: [
      {
        name:        { type: String, required: true },
        model:       { type: String, default: '' },
        type:        { type: String, default: 'Laptop' },
        serialNumber:{ type: String, default: '' },
        addedAt:     { type: Date, default: Date.now },
      }
    ],

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    active:    { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Company', companySchema);
