const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name:       { type: String, required: true, trim: true },
    email:      { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:   { type: String, default: null },
    phone:      { type: String, default: '' },
    role:       { type: String, enum: ['user', 'admin', 'staff'], default: 'user' },
    googleId:   { type: String, default: null },
    avatar:     { type: String, default: '' },
    authProvider: { type: String, enum: ['local', 'google'], default: 'local' },

    // Company / AMC linking
    company:     { type: mongoose.Schema.Types.ObjectId, ref: 'Company', default: null },
    companyRole: { type: String, enum: ['admin', 'member'], default: 'member' },

    // Email activation for AMC onboarding
    activationToken:   { type: String, default: null },
    activationExpires: { type: Date,   default: null },
    activated:         { type: Boolean, default: true }, // false for AMC invite flow
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
