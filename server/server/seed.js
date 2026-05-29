require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const demoProducts = require('./data/demoProducts');

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/coldtech';
  await mongoose.connect(uri);
  console.log('Connected');

  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@coldtech.local').toLowerCase().trim();
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123456';

  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    const hashed = await bcrypt.hash(adminPass, 12);
    admin = await User.create({
      name: 'Coldtech Admin',
      email: adminEmail,
      password: hashed,
      phone: '',
      role: 'admin',
    });
    console.log('Admin user created:', adminEmail);
  } else if (admin.role !== 'admin') {
    admin.role = 'admin';
    await admin.save();
    console.log('Existing user promoted to admin');
  }

  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany(demoProducts);
    console.log(`Inserted ${demoProducts.length} demo products`);
  } else {
    console.log('Products already exist, skipping product seed');
  }

  await mongoose.disconnect();
  console.log('Done');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
