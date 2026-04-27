/**
 * Ensures the admin user exists and password matches ADMIN_PASSWORD in .env.
 * Run: node scripts/ensure-admin.js (from server directory)
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');

async function main() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/coldtech';
  const email = (process.env.ADMIN_EMAIL || 'admin@coldtech.local').toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || 'admin123456';

  await mongoose.connect(uri);
  const hashed = await bcrypt.hash(password, 12);

  let user = await User.findOne({ email });
  if (user) {
    user.password = hashed;
    user.role = 'admin';
    await user.save();
    console.log('Updated admin password for:', email);
  } else {
    user = await User.create({
      name: 'Coldtech Admin',
      email,
      password: hashed,
      phone: '',
      role: 'admin',
    });
    console.log('Created admin user:', email);
  }

  await mongoose.disconnect();
  console.log('Done. You can log in with this email and ADMIN_PASSWORD from .env');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
