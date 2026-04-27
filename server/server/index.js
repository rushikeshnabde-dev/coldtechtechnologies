require('dotenv').config();
const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { connectDB } = require('./config/db');

const authRoutes    = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes   = require('./routes/orderRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const adminRoutes   = require('./routes/adminRoutes');
const staffRoutes   = require('./routes/staffRoutes');
const offerRoutes   = require('./routes/offerRoutes');
const blogRoutes    = require('./routes/blogRoutes');
const amcRoutes     = require('./routes/amcRoutes');

const app  = express();
const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === 'production';


// ================= SECURITY =================
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));


// ================= CORS (IMPROVED) =================
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map(s => s.trim());

app.use(cors({
  origin: function (origin, callback) {

    // allow server-to-server / Postman
    if (!origin) return callback(null, true);

    // allow configured domains
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // allow localhost in dev
    if (!isProd && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
      return callback(null, true);
    }

    console.error("❌ CORS BLOCKED:", origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));


// ================= BODY =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ================= RATE LIMIT =================
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { message: 'Too many login attempts' },
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
});

app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);


// ================= STATIC =================
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// ================= HEALTH =================
app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// ── Step 11: Test email endpoint (admin use only) ──
app.post('/api/test-email', async (req, res) => {
  const { to } = req.body;
  if (!to) return res.status(400).json({ message: 'Provide { "to": "email@example.com" }' });
  const { sendTestEmail } = require('./utils/mailer');
  const result = await sendTestEmail(to);
  res.json(result);
});


// ================= ROUTES =================

// 🔥 AUTH ROUTES (NO DB BLOCK → important for Google login)
app.use('/api/auth', authRoutes);


// DB PROTECTED ROUTES
const { requireDb } = require('./middleware/requireDb');

app.use('/api/products', requireDb, productRoutes);
app.use('/api/orders',   requireDb, orderRoutes);
app.use('/api/services', requireDb, serviceRoutes);
app.use('/api/admin',    requireDb, adminRoutes);
app.use('/api/staff',    requireDb, staffRoutes);
app.use('/api/offers',   requireDb, offerRoutes);
app.use('/api/blog',     requireDb, blogRoutes);
app.use('/api/amc',      requireDb, amcRoutes);


// ================= 404 =================
app.use('/api', (_req, res) => {
  res.status(404).json({ message: 'API route not found' });
});


// ================= ERROR HANDLER =================
app.use((err, _req, res, _next) => {
  console.error("🔥 SERVER ERROR:", err);

  res.status(err.status || 500).json({
    message: err.message || 'Server error',
  });
});


// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


// ================= CONNECT DB =================
connectDB()
  .then(async () => {
    console.log("✅ MongoDB Connected");

    // Verify SMTP mailer on startup
    const { verifyMailer } = require('./utils/mailer');
    await verifyMailer();

    if (process.env.AUTO_BOOTSTRAP !== 'false') {
      await require('./bootstrap').run();
    }
  })
  .catch((err) => {
    console.error("❌ MongoDB FAILED:", err.message);
    console.log("⚠️ Server running WITHOUT database");
  });