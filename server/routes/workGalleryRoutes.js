const express = require('express');
const c = require('../controllers/workGalleryController');
const { auth } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');
const { uploads } = require('../middleware/upload');
const router = express.Router();

router.get('/',        c.list);
router.get('/admin',   auth(true), adminOnly, c.adminList);
router.post('/',       auth(true), adminOnly, uploads.gallery.single('image'), c.create);
router.put('/:id',     auth(true), adminOnly, uploads.gallery.single('image'), c.update);
router.delete('/:id',  auth(true), adminOnly, c.remove);

module.exports = router;
