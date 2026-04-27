const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
const ServiceRequest = require('./models/ServiceRequest');
const Offer = require('./models/Offer');
const demoProducts = require('./data/demoProducts');

/**
 * Seed admin + demo products (no mongoose.disconnect). Call after connectDB().
 */
async function run() {
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
    console.log('Bootstrap: admin user created →', adminEmail);
  } else if (admin.role !== 'admin') {
    admin.role = 'admin';
    await admin.save();
    console.log('Bootstrap: existing user promoted to admin');
  }

  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany(demoProducts);
    console.log(`Bootstrap: inserted ${demoProducts.length} demo products`);
  }

  // Seed a demo staff user — credentials kept private, not logged
  const staffEmail = 'staff@coldtech.local';
  const staffExists = await User.findOne({ email: staffEmail });
  if (!staffExists) {
    const hashed = await bcrypt.hash('staff123456', 12);
    await User.create({ name: 'Demo Staff', email: staffEmail, password: hashed, role: 'staff' });
    console.log('Bootstrap: demo staff user created');
  }

  // Seed a demo offer
  const offerCount = await Offer.countDocuments();
  if (offerCount === 0) {
    const today = new Date();
    const end = new Date(today); end.setDate(end.getDate() + 7);
    await Offer.create({
      title: 'Free Laptop Diagnosis – This Week Only!',
      description: 'Bring in any laptop for a free 30-minute diagnosis. No charges, no obligations.',
      discount: '100% FREE',
      badge: 'Today Only',
      link: '/services/request',
      startDate: today,
      endDate: end,
      status: 'active',
      priority: 10,
    });
    console.log('Bootstrap: demo offer created');
  }

  // Seed a demo service request so track page works out of the box
  const srCount = await ServiceRequest.countDocuments();
  if (srCount === 0) {
    const year = new Date().getFullYear();
    await ServiceRequest.create({
      user: admin._id,
      fullName: 'Demo Customer',
      email: 'demo@coldtech.local',
      phone: '9876543210',
      deviceType: 'Laptop',
      issueType: 'Hardware',
      description: 'Screen flickering and battery not charging.',
      priority: 'Normal',
      ticketId: `CT-${year}-001`,
      status: 'repairing',
      notes: 'Screen cable replaced. Battery replacement in progress.',
    });
    console.log(`Bootstrap: demo ticket created → CT-${year}-001`);
  }

  console.log('');
  console.log('─── Coldtech Server Ready ───────────────────────────────');
  console.log(`  Demo ticket:   CT-${new Date().getFullYear()}-001  (use on Track page)`);
  console.log('─────────────────────────────────────────────────────────');
  console.log('');
}

module.exports = { run };
