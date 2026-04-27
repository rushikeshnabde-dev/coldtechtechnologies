const express = require('express');
const bannerController = require('../controllers/bannerController');
const { auth }      = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');
const { uploads } = require('../middleware/upload');

const router = express.Router();

router.get('/', bannerController.list);
router.get('/admin',  auth(true), adminOnly, bannerController.adminList);
router.post('/',      auth(true), adminOnly, uploads.banners.single('image'), bannerController.create);
router.put('/:id',    auth(true), adminOnly, uploads.banners.single('image'), bannerController.update);
router.delete('/:id', auth(true), adminOnly, bannerController.remove);

module.exports = router;
