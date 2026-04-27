const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  name: { type: String },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [orderItemSchema],
    totalAmount: { type: Number, required: true, min: 0 },
    address: {
      line1: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
