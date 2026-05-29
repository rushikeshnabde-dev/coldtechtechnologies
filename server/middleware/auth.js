const jwt = require('jsonwebtoken');
const User = require('../models/User');

function auth(required = true) {
  return async (req, res, next) => {
    const header = req.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
      if (required) return res.status(401).json({ message: 'Authentication required' });
      return next();
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'coldtech-dev-secret');
      const user = await User.findById(decoded.userId).select('-password');
      if (!user) return res.status(401).json({ message: 'User not found' });
      req.user = user;
      next();
    } catch {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
}

function optionalAuth() {
  return async (req, res, next) => {
    const header = req.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return next();
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'coldtech-dev-secret');
      const user = await User.findById(decoded.userId).select('-password');
      if (user) req.user = user;
    } catch {
      /* invalid token — continue as guest */
    }
    next();
  };
}

module.exports = { auth, optionalAuth };
