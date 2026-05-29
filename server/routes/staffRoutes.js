const express = require('express');
const staffController = require('../controllers/staffController');
const { auth } = require('../middleware/auth');
const { staffOrAdmin } = require('../middleware/admin');

const router = express.Router();

// Staff-only: view and update their own assigned orders
router.use(auth(true), staffOrAdmin);

router.get('/my-orders', staffController.myOrders);
router.patch('/my-orders/:orderId/status', staffController.updateMyOrder);

module.exports = router;
