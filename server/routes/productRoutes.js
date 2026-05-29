const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

router.get('/meta', productController.meta);
router.get('/', productController.list);
router.get('/:id', productController.getOne);

module.exports = router;
