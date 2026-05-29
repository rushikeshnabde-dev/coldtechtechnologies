function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

function staffOrAdmin(req, res, next) {
  if (!req.user || !['admin', 'staff'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Staff or admin access required' });
  }
  next();
}

module.exports = { adminOnly, staffOrAdmin };
