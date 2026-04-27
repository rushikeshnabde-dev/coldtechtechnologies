const express    = require('express');
const amc        = require('../controllers/amcController');
const { auth }   = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

const router = express.Router();

// Public — account activation
router.post('/activate', amc.activateAccount);

// Authenticated client routes
router.get('/my-company',       auth(true), amc.myCompany);
router.get('/my-devices',       auth(true), amc.myDevices);
router.post('/my-devices',      auth(true), amc.addMyDevice);

// Admin routes
router.get('/',                 auth(true), adminOnly, amc.listCompanies);
router.post('/',                auth(true), adminOnly, amc.createCompany);
router.get('/:id',              auth(true), adminOnly, amc.getCompany);
router.put('/:id',              auth(true), adminOnly, amc.updateCompany);
router.delete('/:id',           auth(true), adminOnly, amc.deleteCompany);
router.post('/:id/users',       auth(true), adminOnly, amc.addCompanyUser);
router.post('/:id/devices',     auth(true), adminOnly, amc.addDevice);
router.post('/resend/:userId',  auth(true), adminOnly, amc.resendActivation);

module.exports = router;
