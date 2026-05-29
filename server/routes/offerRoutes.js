const express = require('express');
const offerController = require('../controllers/offerController');
const { auth } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

const router = express.Router();

// Public
router.get('/today', offerController.today);

// Admin-protected
router.get('/',         auth(true), adminOnly, offerController.list);
router.post('/',        auth(true), adminOnly, offerController.create);
router.put('/:id',      auth(true), adminOnly, offerController.update);
router.delete('/:id',   auth(true), adminOnly, offerController.remove);
router.patch('/:id/toggle', auth(true), adminOnly, offerController.toggle);

module.exports = router;
