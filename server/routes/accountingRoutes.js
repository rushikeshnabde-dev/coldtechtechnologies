const express = require('express');
const { auth }      = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

const ledgerCtrl  = require('../controllers/ledgerController');
const partyCtrl   = require('../controllers/partyController');
const productCtrl = require('../controllers/accountingProductController');
const invoiceCtrl = require('../controllers/accountingInvoiceController');
const paymentCtrl = require('../controllers/paymentController');
const reportsCtrl = require('../controllers/reportsController');

const router = express.Router();
router.use(auth(true), adminOnly);

/* ── Ledgers ── */
router.get('/ledgers/seed',        ledgerCtrl.seed);
router.get('/ledgers/:id/statement', ledgerCtrl.statement);
router.get('/ledgers',             ledgerCtrl.list);
router.get('/ledgers/:id',         ledgerCtrl.get);
router.post('/ledgers',            ledgerCtrl.create);
router.put('/ledgers/:id',         ledgerCtrl.update);
router.delete('/ledgers/:id',      ledgerCtrl.remove);

/* ── Parties ── */
router.get('/parties',             partyCtrl.list);
router.get('/parties/:id',         partyCtrl.get);
router.post('/parties',            partyCtrl.create);
router.put('/parties/:id',         partyCtrl.update);
router.delete('/parties/:id',      partyCtrl.remove);

/* ── Products ── */
router.get('/products',            productCtrl.list);
router.get('/products/:id',        productCtrl.get);
router.post('/products',           productCtrl.create);
router.put('/products/:id',        productCtrl.update);
router.delete('/products/:id',     productCtrl.remove);

/* ── Accounting Invoices ── */
router.get('/invoices',            invoiceCtrl.list);
router.get('/invoices/:id',        invoiceCtrl.get);
router.post('/invoices',           invoiceCtrl.create);
router.put('/invoices/:id',        invoiceCtrl.update);
router.post('/invoices/:id/cancel',invoiceCtrl.cancel);
router.delete('/invoices/:id',     invoiceCtrl.remove);

/* ── Payments ── */
router.get('/payments',            paymentCtrl.list);
router.get('/payments/:id',        paymentCtrl.get);
router.post('/payments',           paymentCtrl.create);
router.delete('/payments/:id',     paymentCtrl.remove);

/* ── Reports ── */
router.get('/reports/ledger',      reportsCtrl.ledgerReport);
router.get('/reports/pl',          reportsCtrl.profitLoss);
router.get('/reports/gst',         reportsCtrl.gstSummary);
router.get('/reports/dashboard',   reportsCtrl.dashboard);

module.exports = router;
