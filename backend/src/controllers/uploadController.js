const multer = require('multer');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');

// Configuration Multer pour stockage local
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = file.originalname.split('.').pop();
    cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  // On accepte tout pour débloquer l'utilisateur
  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter
});

/**
 * Upload un fichier vers le stockage local
 */
const uploadFile = asyncHandler(async (req, res, next) => {
  if (!req.file) return next(new AppError('Veuillez fournir un fichier', 400));

  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  
  res.status(200).json({
    success: true,
    data: {
      url: fileUrl,
      filename: req.file.filename,
      type: req.file.mimetype,
      taille: req.file.size
    }
  });
});

/**
 * Supprimer un fichier de Cloudinary
 */
const deleteFile = asyncHandler(async (req, res, next) => {
  const { publicId } = req.body;
  if (!publicId) return next(new AppError('publicId est obligatoire', 400));

  await deleteFromCloudinary(publicId);

  res.status(200).json({
    success: true,
    message: 'Fichier supprimé avec succès'
  });
});

module.exports = {
  upload,
  uploadFile,
  deleteFile
};
