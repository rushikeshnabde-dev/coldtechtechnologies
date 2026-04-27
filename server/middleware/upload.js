/**
 * upload.js — Cloudinary storage via multer
 * Uses unsigned uploads (no signature required) for simplicity.
 */

const multer   = require('multer');
const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

function makeStorage(folder) {
  return new CloudinaryStorage({
    cloudinary,
    params: async (_req, file) => ({
      folder,
      public_id: `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.]/g, '_').replace(/\.[^.]+$/, '')}`,
      resource_type: 'image',
    }),
  });
}

function makeUpload(folder) {
  return multer({
    storage: makeStorage(folder),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      const ok = /^image\/(jpeg|png|gif|webp|jpg)$/i.test(file.mimetype);
      cb(ok ? null : new Error('Only image files are allowed'), ok);
    },
  });
}

const uploads = {
  team:         makeUpload('coldtech/team'),
  banners:      makeUpload('coldtech/banners'),
  testimonials: makeUpload('coldtech/testimonials'),
  gallery:      makeUpload('coldtech/gallery'),
  products:     makeUpload('coldtech/products'),
  services:     makeUpload('coldtech/services'),
};

// fallback general upload
const upload = makeUpload('coldtech/general');

/* ── Delete a Cloudinary image by URL ── */
async function deleteCloudinaryImage(url) {
  if (!url || !url.startsWith('http')) return;
  try {
    const parts    = url.split('/');
    const uploadIdx = parts.indexOf('upload');
    if (uploadIdx === -1) return;
    const afterUpload = parts.slice(uploadIdx + 1);
    if (/^v\d+$/.test(afterUpload[0])) afterUpload.shift();
    const publicId = afterUpload.join('/').replace(/\.[^.]+$/, '');
    await cloudinary.uploader.destroy(publicId);
  } catch (e) {
    console.warn('Cloudinary delete warning:', e.message);
  }
}

module.exports = { upload, uploads, deleteCloudinaryImage };
