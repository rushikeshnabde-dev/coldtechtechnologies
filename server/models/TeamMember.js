const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name:           { type: String, required: true, trim: true },
  role:           { type: String, required: true, trim: true },
  bio:            { type: String, default: '', maxlength: 200 },
  experience:     { type: String, default: '' },
  skills:         [{ type: String }],
  certifications: { type: String, default: '' },
  linkedin:       { type: String, default: '' },
  location:       { type: String, default: '' },
  image:          { type: String, default: '' },
  workImages:     [{ type: String }],
  featured:       { type: Boolean, default: false },
  visible:        { type: Boolean, default: true },
  order:          { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('TeamMember', teamSchema);
