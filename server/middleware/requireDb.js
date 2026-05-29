const mongoose = require('mongoose');

/** Block API routes until MongoDB is connected; avoids hanging requests. */
function requireDb(req, res, next) {
  if (mongoose.connection.readyState === 1) return next();
  return res.status(503).json({
    message:
      'Database unavailable. Start MongoDB locally, or set MONGODB_URI in server/.env to a MongoDB Atlas connection string, then restart the server.',
  });
}

module.exports = { requireDb };
