const express = require('express');
const { upload, uploadFile, deleteFile } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/', (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return next(err);
    }
    uploadFile(req, res, next);
  });
});
router.delete('/', deleteFile);

module.exports = router;
