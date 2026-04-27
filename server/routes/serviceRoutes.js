const express = require('express');
const { body } = require('express-validator');
const serviceController = require('../controllers/serviceController');
const { auth, optionalAuth } = require('../middleware/auth');
const { uploads } = require('../middleware/upload');

const router = express.Router();

router.post(
  '/',
  optionalAuth(),
  uploads.services.single('image'),
  [
    body('fullName').trim().notEmpty(),
    body('email').isEmail(),
    body('phone').trim().notEmpty(),
    body('deviceType').isIn(['Laptop', 'Desktop', 'Mobile', 'Smartphone', 'Tablet', 'Other']),
    body('issueType').isIn(['Hardware', 'Software', 'Virus', 'Network', 'Upgrade', 'Other']),
    body('description').trim().notEmpty(),
    body('priority').optional().isIn(['Low', 'Normal', 'High', 'Critical', 'Urgent']),
  ],
  (req, res, next) => {
    const { validationResult } = require('express-validator');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }
    next();
  },
  serviceController.create
);

router.get('/track/:ticketId', serviceController.track);
router.get('/mine', auth(true), serviceController.myRequests);

module.exports = router;
