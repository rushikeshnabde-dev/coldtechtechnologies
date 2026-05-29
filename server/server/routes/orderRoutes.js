const express = require('express');
const orderController = require('../controllers/orderController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth(true), orderController.create);
router.get('/mine', auth(true), orderController.myOrders);
router.get('/:id', auth(true), orderController.getOne);

module.exports = router;
