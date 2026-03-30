const Demande = require('../models/Demande');
const DocumentType = require('../models/DocumentType');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');
const { generateDocumentPDF } = require('../utils/pdfGenerator');

/**
 * Helper to find demande by ID or Reference
 */
const _findDemande = async (idOrRef) => {
  if (idOrRef.startsWith('CDB-')) {
    return await Demande.findOne({ reference: idOrRef }).populate('documentTypeId');
  }
  try {
    return await Demande.findById(idOrRef).populate('documentTypeId');
  } catch (e) {
    return await Demande.findOne({ reference: idOrRef }).populate('documentTypeId');
  }
};


/**
 * Récupérer les demandes du service de l'agent
 */
exports.getDemandesAgent = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // 1. Trouver les types de documents gérés par le service de l'agent
  console.log('DEBUG: getDemandesAgent for:', req.user.email, '| Service:', req.user.service);
  const serviceDocs = await DocumentType.find({ service: req.user.service }).select('_id');
  const docTypeIds = serviceDocs.map(d => d._id);
  console.log('DEBUG: docTypeIds found:', docTypeIds);

  // 2. Filtres
  const filter = { documentTypeId: { $in: docTypeIds } };
  console.log('DEBUG: Filter:', JSON.stringify(filter));
  if (req.query.statut) filter.statut = req.query.statut;
  if (req.query.reference) filter.reference = req.query.reference;

  const total = await Demande.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);

  // 3. Récupérer les demandes (EN_ATTENTE en premier)
  const demandes = await Demande.find(filter)
    .populate('citoyenId', 'nom prenom email')
    .populate('documentTypeId', 'code nom service')
    .sort({ statut: 1, dateSoumission: -1 }) // Newest first within each status group
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: demandes.length,
    total,
    totalPages,
    currentPage: page,
    data: demandes
  });
});

/**
 * Prendre en charge une demande
 */
exports.prendreEnCharge = asyncHandler(async (req, res, next) => {
  const demande = await _findDemande(req.params.id);

  if (!demande) {
    return next(new AppError('Demande non trouvée', 404));
  }

  // Vérifier service
  if (demande.documentTypeId.service !== req.user.service && req.user.role !== 'ADMIN') {
    return next(new AppError('Accès interdit aux demandes d\'un autre service', 403));
  }

  // Vérifier statut
  if (demande.statut !== 'EN_ATTENTE') {
    return next(new AppError('Cette demande est déjà prise en charge ou traitée', 400));
  }

  demande.agentId = req.user._id;
  demande.statut = 'EN_COURS';
  demande.datePriseEnCharge = new Date();

  await demande.addToHistorique('PRISE_EN_CHARGE', req.user, 'Demande prise en charge par un agent');

  await Notification.createForDemande(
    demande.citoyenId,
    demande._id,
    'PRISE_EN_CHARGE',
    'Demande en cours de traitement',
    `Votre demande ${demande.reference} est maintenant traitée par un agent.`,
    { reference: demande.reference, statut: demande.statut }
  );

  res.status(200).json({
    success: true,
    message: 'Demande prise en charge',
    data: demande
  });
});

/**
 * Valider une demande
 */
exports.validerDemande = asyncHandler(async (req, res, next) => {
  const demande = await _findDemande(req.params.id);

  if (!demande) return next(new AppError('Demande non trouvée', 404));
  
  if (demande.documentTypeId.service !== req.user.service && req.user.role !== 'ADMIN') {
    return next(new AppError('Accès interdit', 403));
  }

  // Générer le PDF
  const pdfResult = await generateDocumentPDF(demande, req.user);
  
  let finalUrl = pdfResult.url;
  if (finalUrl && finalUrl.startsWith('/')) {
    finalUrl = `${req.protocol}://${req.get('host')}${finalUrl}`;
  }
  
  demande.statut = 'VALIDEE';
  demande.dateTraitement = new Date();
  demande.notesAgent = req.body.notes || 'Document validé après vérification.';
  demande.documentPDF = {
    url: finalUrl,
    publicId: pdfResult.publicId,
    genereLe: pdfResult.genereLe,
    expireLe: pdfResult.expireLe
  };


  await demande.addToHistorique('VALIDATION', req.user, req.body.notes || 'Validation finale');

  await Notification.createForDemande(
    demande.citoyenId,
    demande._id,
    'VALIDEE',
    'Demande validée !',
    `Votre document ${demande.reference} est prêt. Vous pouvez le télécharger.`,
    { reference: demande.reference, statut: demande.statut }
  );

  await AuditLog.createLog({
    action: 'VALIDATION_DEMANDE',
    categorie: 'DEMANDE',
    auteurId: req.user._id,
    auteurEmail: req.user.email,
    auteurRole: req.user.role,
    auteurIp: req.ip,
    cibleType: 'Demande',
    cibleId: demande._id,
    cibleReference: demande.reference,
    description: `Validation document ${demande.reference}`
  });

  res.status(200).json({
    success: true,
    message: 'Demande validée avec succès',
    data: demande
  });
});

/**
 * Rejeter une demande
 */
exports.rejeterDemande = asyncHandler(async (req, res, next) => {
  const { motif } = req.body;
  if (!motif) return next(new AppError('Un motif de rejet est obligatoire', 400));

  const demande = await _findDemande(req.params.id);

  if (!demande) return next(new AppError('Demande non trouvée', 404));
  
  if (demande.documentTypeId.service !== req.user.service && req.user.role !== 'ADMIN') {
    return next(new AppError('Accès interdit', 403));
  }

  demande.statut = 'REJETEE';
  demande.motifRejet = motif;
  demande.dateTraitement = new Date();

  await demande.addToHistorique('REJET', req.user, `Rejet: ${motif}`);

  await Notification.createForDemande(
    demande.citoyenId,
    demande._id,
    'REJETEE',
    'Demande rejetée',
    `Votre demande ${demande.reference} a été rejetée. Motif : ${motif}`,
    { reference: demande.reference, statut: demande.statut }
  );

  await AuditLog.createLog({
    action: 'REJET_DEMANDE',
    categorie: 'DEMANDE',
    auteurId: req.user._id,
    auteurEmail: req.user.email,
    auteurRole: req.user.role,
    auteurIp: req.ip,
    cibleType: 'Demande',
    cibleId: demande._id,
    cibleReference: demande.reference,
    description: `Rejet demande ${demande.reference}: ${motif}`
  });

  res.status(200).json({
    success: true,
    message: 'Demande rejetée',
    data: demande
  });
});

/**
 * Demander des documents complémentaires
 */
exports.demanderComplement = asyncHandler(async (req, res, next) => {
  const { documentsManquants, message } = req.body;
  if (!documentsManquants || !Array.isArray(documentsManquants) || documentsManquants.length === 0) {
    return next(new AppError('Veuillez spécifier la liste des documents manquants', 400));
  }

  const demande = await _findDemande(req.params.id);

  if (!demande) return next(new AppError('Demande non trouvée', 404));
  
  if (demande.documentTypeId.service !== req.user.service && req.user.role !== 'ADMIN') {
    return next(new AppError('Accès interdit', 403));
  }

  demande.statut = 'DOCUMENTS_MANQUANTS';
  demande.documentsManquants = documentsManquants;
  demande.notesAgent = message;

  await demande.addToHistorique('DEMANDE_COMPLEMENT', req.user, `Documents manquants: ${documentsManquants.join(', ')}`);

  await Notification.createForDemande(
    demande.citoyenId,
    demande._id,
    'DOCUMENTS_MANQUANTS',
    'Documents complémentaires requis',
    `Des documents manquent pour traiter votre demande ${demande.reference} : ${documentsManquants.join(', ')}`,
    { reference: demande.reference, statut: demande.statut }
  );

  res.status(200).json({
    success: true,
    message: 'Complément demandé au citoyen',
    data: demande
  });
});

/**
 * Statistiques de l'agent
 */
exports.getStatsAgent = asyncHandler(async (req, res) => {
  const serviceDocs = await DocumentType.find({ service: req.user.service }).select('_id');
  const docTypeIds = serviceDocs.map(d => d._id);

  const stats = await Demande.aggregate([
    { $match: { documentTypeId: { $in: docTypeIds } } },
    { $group: { _id: '$statut', count: { $sum: 1 } } }
  ]);

  const mesActions = await Demande.countDocuments({ agentId: req.user._id });

  res.status(200).json({
    success: true,
    data: {
      statsService: stats,
      mesActionsTraitement: mesActions
    }
  });
});
