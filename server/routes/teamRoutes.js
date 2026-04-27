const express = require('express');
const c = require('../controllers/teamController');
const { auth } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');
const { uploads } = require('../middleware/upload');
const router = express.Router();

const teamUpload = uploads.team.fields([
  { name: 'image',      maxCount: 1 },
  { name: 'workImages', maxCount: 5 },
]);

router.get('/',        c.list);
router.get('/admin',   auth(true), adminOnly, c.adminList);
router.post('/',       auth(true), adminOnly, teamUpload, c.create);
router.put('/:id',     auth(true), adminOnly, teamUpload, c.update);
router.delete('/:id',  auth(true), adminOnly, c.remove);

module.exports = router;
