const express = require('express');
const ctrl    = require('../controllers/invoiceController');
const { auth }      = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

const router = express.Router();
router.use(auth(true), adminOnly);

/* ── templates MUST come before /:id to avoid param collision ── */
router.get('/templates/default',  ctrl.getDefaultTemplate);
router.get('/templates',          ctrl.listTemplates);
router.post('/templates',         ctrl.createTemplate);
router.put('/templates/:id',      ctrl.updateTemplate);
router.delete('/templates/:id',   ctrl.removeTemplate);

/* ── invoices ── */
router.get('/',           ctrl.list);
router.get('/:id/render', ctrl.render);
router.get('/:id',        ctrl.get);
router.post('/',          ctrl.create);
router.put('/:id',        ctrl.update);
router.delete('/:id',     ctrl.remove);

module.exports = router;
