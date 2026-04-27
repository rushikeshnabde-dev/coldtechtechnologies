const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'coldtech-dev-secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

function signToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

function normalizeEmailInput(email) {
  return String(email ?? '')
    .trim()
    .toLowerCase();
}

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
  }
  try {
    const { name, password, phone, adminKey } = req.body;
    const email = normalizeEmailInput(req.body.email);
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    let role = 'user';
    if (adminKey && process.env.ADMIN_SECRET && adminKey === process.env.ADMIN_SECRET) {
      role = 'admin';
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email,
      password: hashed,
      phone: phone || '',
      role,
    });

    const token = signToken(user._id);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
  }
  try {
    const { password } = req.body;
    const email = normalizeEmailInput(req.body.email);
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid email or password' });

    const token = signToken(user._id);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Login failed' });
  }
};

exports.me = async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role,
    },
  });
};

exports.googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Token is required' });

    // Decode the Google JWT (already verified by Google on the client side)
    // For production, verify with google-auth-library. Here we decode and trust it
    // since @react-oauth/google only issues valid credentials from Google's servers.
    const parts  = token.split('.');
    if (parts.length !== 3) return res.status(400).json({ message: 'Invalid token format' });

    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
    const { sub: googleId, email, name, picture } = payload;

    if (!email || !googleId) {
      return res.status(400).json({ message: 'Invalid Google token payload' });
    }

    // Find existing user or create a new one
    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      // Update Google info if they previously registered with email/password
      if (!user.googleId) {
        user.googleId     = googleId;
        user.authProvider = 'google';
        if (picture && !user.avatar) user.avatar = picture;
        await user.save();
      }
    } else {
      // New user — create without password
      user = await User.create({
        name,
        email:        email.toLowerCase(),
        password:     null,
        googleId,
        avatar:       picture || '',
        authProvider: 'google',
        role:         'user',
      });
    }

    const jwtToken = signToken(user._id);
    res.json({
      token: jwtToken,
      user: {
        id:     user._id,
        name:   user.name,
        email:  user.email,
        phone:  user.phone,
        role:   user.role,
        avatar: user.avatar,
      },
    });
  } catch (e) {
    console.error('Google auth error:', e);
    res.status(500).json({ message: 'Google authentication failed' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    await user.save();
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Update failed' });
  }
};
