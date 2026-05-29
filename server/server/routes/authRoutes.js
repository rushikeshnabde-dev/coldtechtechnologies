const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
  ],
  authController.register
);

router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').notEmpty(),
  ],
  authController.login
);

router.post('/google', authController.googleAuth);

router.get('/me', auth(true), authController.me);

module.exports = router;