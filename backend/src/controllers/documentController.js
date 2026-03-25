const DocumentType = require('../models/DocumentType');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * Récupère tous les types de documents actifs
 */
exports.getAllDocuments = asyncHandler(async (req, res) => {
  const documents = await DocumentType.findActive().select(
    'code nom description frais delaiJours categorie service justificatifs champsSpecifiques'
  );

  res.status(200).json({
    success: true,
    count: documents.length,
    data: documents
  });
});

/**
 * Récupère un document complet par son code
 */
exports.getDocumentByCode = asyncHandler(async (req, res, next) => {
  const document = await DocumentType.findByCode(req.params.code);

  if (!document) {
    return next(new AppError('Type de document non trouvé', 404));
  }

  res.status(200).json({
    success: true,
    data: document
  });
});
