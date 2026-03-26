const Demande = require('../models/Demande');
const DocumentType = require('../models/DocumentType');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');
const logger = require('../utils/logger');

/**
 * Statistiques globales pour le dashboard admin
 */
exports.getStatsGlobales = asyncHandler(async (req, res) => {
  // 1. Stats demandes par statut
  const statsStatut = await Demande.aggregate([
    { $group: { _id: '$statut', count: { $sum: 1 } } }
  ]);

  // 2. Stats par service
  const statsService = await Demande.aggregate([
    {
      $lookup: {
        from: 'documenttypes',
        localField: 'documentTypeId',
        foreignField: '_id',
        as: 'docType'
      }
    },
    { $unwind: '$docType' },
    { $group: { _id: '$docType.service', count: { $sum: 1 } } }
  ]);

  // 3. Totaux pour le frontend
  const totalDemandes = await Demande.countDocuments();
  const enAttente = statsStatut.find(s => s._id === 'EN_ATTENTE')?.count || 0;
  const totalCitoyens = await User.countDocuments({ role: 'CITOYEN' });
  const totalAgents = await User.countDocuments({ 
    role: { $in: ['AGENT_MAIRIE', 'AGENT_JUSTICE', 'SUPERVISEUR'] } 
  });

  res.status(200).json({
    success: true,
    data: {
      totalDemandes,
      enAttente,
      totalCitoyens,
      totalAgents,
      parService: statsService,
      parStatut: statsStatut
    }
  });
});

/**
 * Gérer les agents (création)
 */
exports.createUser = asyncHandler(async (req, res, next) => {
  const { nom, prenom, email, telephone, role, service, password } = req.body;

  // Seul l'admin peut créer un autre admin ou agent
  const existingUser = await User.findOne({ email });
  if (existingUser) return next(new AppError('Cet email est déjà utilisé', 400));

  const passwordTemp = password || Math.random().toString(36).slice(-8);

  // Génération automatique du matricule si non fourni
  let finalMatricule = req.body.matricule;
  if (!finalMatricule && role !== 'CITOYEN') {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    finalMatricule = `BF-${role.split('_').pop()}-${randomNum}`;
  }

  const newUser = await User.create({
    nom,
    prenom,
    email,
    telephone,
    password: passwordTemp,
    role,
    service,
    matricule: finalMatricule
  });

  await AuditLog.createLog({
    action: 'CREATION_AGENT',
    categorie: 'ADMIN',
    auteurId: req.user._id,
    auteurEmail: req.user.email,
    auteurRole: req.user.role,
    auteurIp: req.ip,
    cibleType: 'User',
    cibleId: newUser._id,
    description: `Création du compte ${role} pour ${email}`
  });

  // TODO: intégrer un vrai service d'envoi d'email
  logger.info(`[EMAIL] Credentials envoyés à : ${email}`);

  res.status(201).json({
    success: true,
    data: newUser,
    passwordTemp: password === undefined ? passwordTemp : undefined
  });
});

/**
 * Liste de tous les utilisateurs
 */
exports.getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.service) filter.service = req.query.service;
  if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

  const total = await User.countDocuments(filter);
  const users = await User.find(filter)
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: users.length,
    total,
    totalPages: Math.ceil(total / limit),
    data: users
  });
});

/**
 * Activer / Désactiver un compte
 */
exports.toggleUserStatus = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError('Utilisateur non trouvé', 404));

  user.isActive = !user.isActive;
  await user.save({ validateBeforeSave: false });

  await AuditLog.createLog({
    action: 'MODIFICATION_USER',
    categorie: 'ADMIN',
    auteurId: req.user._id,
    auteurEmail: req.user.email,
    auteurRole: req.user.role,
    auteurIp: req.ip,
    cibleType: 'User',
    cibleId: user._id,
    description: `Changement statut isActive pour ${user.email} -> ${user.isActive}`
  });

  res.status(200).json({
    success: true,
    message: `Compte ${user.isActive ? 'activé' : 'désactivé'}`,
    isActive: user.isActive
  });
});

/**
 * Consulter les logs d'audit
 */
exports.getAuditLogs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = (page - 1) * limit;

  const logs = await AuditLog.find()
    .populate('auteurId', 'nom prenom role')
    .sort('-timestamp')
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: logs.length,
    data: logs
  });
});

/**
 * Récupérer toutes les demandes (Gestion globale admin)
 */
exports.getAllDemandes = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  // Construction du filtre
  const filter = {};
  if (req.query.statut) filter.statut = req.query.statut;
  
  // Filtre par service (nécessite un lookup si on filtre sur DocumentType)
  // Utilisons une approche simple d'abord
  if (req.query.documentType) filter.documentTypeId = req.query.documentType;
  
  // Filtre par dates
  if (req.query.dateDebut || req.query.dateFin) {
    filter.dateSoumission = {};
    if (req.query.dateDebut) filter.dateSoumission.$gte = new Date(req.query.dateDebut);
    if (req.query.dateFin) filter.dateSoumission.$lte = new Date(req.query.dateFin);
  }

  // Si filtrage par service, on doit d'abord trouver les IDs des documents de ce service
  if (req.query.service) {
    const serviceDocs = await DocumentType.find({ service: req.query.service }).select('_id');
    const docTypeIds = serviceDocs.map(d => d._id);
    filter.documentTypeId = { $in: docTypeIds };
  }

  const total = await Demande.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);

  const demandes = await Demande.find(filter)
    .populate('citoyenId', 'nom prenom email')
    .populate('documentTypeId', 'code nom service')
    .populate('agentId', 'nom prenom')
    .sort({ dateSoumission: -1 })
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
