const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    deviceType: {
      type: String,
      enum: ['Laptop', 'Desktop', 'Mobile', 'Smartphone', 'Tablet', 'Other'],
      required: true,
    },
    issueType: {
      type: String,
      enum: ['Hardware', 'Software', 'Virus', 'Network', 'Upgrade', 'Other'],
      required: true,
    },
    description: { type: String, required: true },
    image: { type: String, default: '' },
    priority: { type: String, enum: ['Low', 'Normal', 'High', 'Critical', 'Urgent'], default: 'Normal' },
    status: {
      type: String,
      enum: ['received', 'diagnosing', 'repairing', 'completed'],
      default: 'received',
    },
    notes: { type: String, default: '' },
    ticketId: { type: String, required: true, unique: true },
    estimatedCompletion: { type: Date, default: null },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
