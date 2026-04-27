const express = require('express');
const adminController = require('../controllers/adminController');
const staffController = require('../controllers/staffController');
const blogController  = require('../controllers/blogController');
const { auth } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');
const { upload } = require('../middleware/upload');

const router = express.Router();

router.use(auth(true), adminOnly);

router.get('/stats', adminController.dashboard);

// Customer management
router.get('/customers', adminController.customers.list);
router.get('/customers/:id', adminController.customers.profile);

// Staff management — specific routes BEFORE parameterized /:id routes
router.get('/staff', staffController.list);
router.post('/staff', staffController.create);
router.get('/staff/performance', staffController.performance);  // must be before /:id
router.put('/staff/:id', staffController.update);
router.delete('/staff/:id', staffController.remove);
router.patch('/orders/:orderId/assign', staffController.assignOrder);

router.post(
  '/products',
  upload.array('images', 8),
  adminController.products.create
);
router.patch('/products/:id/stock', adminController.products.patchStock);
router.put('/products/:id', upload.array('images', 8), adminController.products.update);
router.delete('/products/:id', adminController.products.remove);

router.get('/orders', adminController.orders.list);
router.patch('/orders/:id/status', adminController.orders.updateStatus);

router.get('/services', adminController.services.list);
router.patch('/services/:id/assign', adminController.services.assign);
router.patch('/services/:id', adminController.services.update);

// Blog management
router.get('/blog',     blogController.adminList);
router.post('/blog',    blogController.create);
router.put('/blog/:id', blogController.update);
router.delete('/blog/:id', blogController.remove);

// AMC / Company management (proxied from amcRoutes via adminOnly guard)
const amc = require('../controllers/amcController');
router.get('/amc',           amc.listCompanies);
router.post('/amc',          amc.createCompany);
router.get('/amc/:id',       amc.getCompany);
router.put('/amc/:id',       amc.updateCompany);
router.delete('/amc/:id',    amc.deleteCompany);
router.post('/amc/:id/users',   amc.addCompanyUser);
router.post('/amc/:id/devices', amc.addDevice);
router.post('/amc/resend/:userId', amc.resendActivation);

module.exports = router;
