const express = require('express');
const ctrl = require('../controllers/expenseController');
const { auth }      = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

const router = express.Router();

router.use(auth(true), adminOnly);

router.get('/',          ctrl.list);
router.get('/summary',   ctrl.summary);
router.post('/',         ctrl.create);
router.put('/:id',       ctrl.update);
router.delete('/:id',    ctrl.remove);

module.exports = router;
