const express = require('express');
const blogController = require('../controllers/blogController');

const router = express.Router();

// Public routes
router.get('/',      blogController.list);
router.get('/:slug', blogController.getBySlug);

module.exports = router;
