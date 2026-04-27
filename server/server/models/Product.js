const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category: { type: String, required: true, trim: true },
    brand: { type: String, default: 'Coldtech', trim: true },
    images: [{ type: String }],
    costPrice: { type: Number, required: true, min: 0 },
    sellingPrice: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    discount: { type: Number, min: 0, max: 100, default: 0 },
    featured: { type: Boolean, default: false },
    popularity: { type: Number, default: 0 },
    condition: { type: String, enum: ['New', 'Refurbished', 'Used'], default: 'New' },
    ram: { type: String, default: '' },        // e.g. "8GB"
    storage: { type: String, default: '' },    // e.g. "SSD 512GB"
    storageType: { type: String, default: '' },// e.g. "SSD" | "HDD" | "NVMe"
    processor: { type: String, default: '' },  // e.g. "i5"
    rating: { type: Number, default: 4, min: 1, max: 5 },
    reviewCount: { type: Number, default: 0 },
    specs: [{ label: String, value: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
