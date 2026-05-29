const express = require('express');
const router  = express.Router();
const { auth }     = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');
const aiController  = require('../controllers/aiController');

router.post('/generate-blog', auth(true), adminOnly, aiController.generateBlog);

module.exports = router;
