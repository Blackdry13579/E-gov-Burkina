const Demande = require('../models/Demande');
const DocumentType = require('../models/DocumentType');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');
const logger = require('../utils/logger');

/**
 * Création d'une nouvelle demande
 */
exports.createDemande = asyncHandler(async (req, res, next) => {
  const { documentTypeId, donnees, fichiers, modeLivraison, paiement } = req.body;

  // 1. Vérifier le type de document
  const docType = await DocumentType.findById(documentTypeId);
  if (!docType || !docType.actif) {
    return next(new AppError('Type de document non valide ou inactif', 404));
  }

  // 2. Valider les champs spécifiques obligatoires
  const manquants = [];
  docType.champsSpecifiques.forEach((champ) => {
    if (champ.obligatoire && (!donnees || !donnees[champ.nom])) {
      manquants.push(champ.label || champ.nom);
    }
  });

  if (manquants.length > 0) {
    logger.warn(`Champs obligatoires manquants (ignorés pour démo) : ${manquants.join(', ')}`);
    // return next(new AppError(`Champs obligatoires manquants : ${manquants.join(', ')}`, 400));
  }

  // 3. Valider les justificatifs obligatoires
  const docsManquants = [];
  docType.justificatifs.forEach((doc) => {
    if (doc.obligatoire) {
      const present = fichiers && fichiers.find((f) => f.code === doc.code);
      if (!present) {
        docsManquants.push(doc.nom || doc.code);
      }
    }
  });

  if (docsManquants.length > 0) {
    logger.warn(`Justificatifs obligatoires manquants (ignorés pour démo) : ${docsManquants.join(', ')}`);
    // return next(new AppError(`Justificatifs obligatoires manquants : ${docsManquants.join(', ')}`, 400));
  }

  // 4. Calculer le montant et paramétrer le paiement
  const frais = docType.frais;
  const methodePaiement = frais === 0 ? 'GRATUIT' : (paiement && paiement.methode) || 'ORANGE_MONEY';

  const mongoose = require('mongoose');

  // 5. Créer la demande
  const demande = await Demande.create({
    citoyenId: new mongoose.Types.ObjectId(req.user._id),
    documentTypeId: new mongoose.Types.ObjectId(documentTypeId),
    donnees,
    fichiers,
    modeLivraison: modeLivraison || 'NUMERIQUE',
    statut: 'EN_ATTENTE',
    paiement: {
      montant: frais,
      methode: methodePaiement,
      statut: frais === 0 ? 'PAYE' : 'EN_ATTENTE',
      telephone: paiement && paiement.telephone
    },
    ipCreation: req.ip
  });

  // 6. Créer notification pour le CITOYEN (on peut déjà le lancer en parallèle)
  const notificationsPromises = [
    Notification.createForDemande(
      req.user._id,
      demande._id,
      'DEMANDE_RECUE',
      'Demande reçue',
      `Votre demande d'un ${docType.nom} a été enregistrée avec succès.`,
      { reference: demande.reference, statut: demande.statut }
    )
  ];

  // 7. & 8. Chercher les destinataires (Agents et Admins) en une fois ou en parallèle
  const [agents, admins] = await Promise.all([
    User.find({ role: { $regex: /^AGENT_/ }, service: docType.service, isActive: true }),
    User.find({ role: 'ADMIN', isActive: true })
  ]);

  // Ajouter les notifs agents
  agents.forEach(agent => {
    notificationsPromises.push(Notification.create({
      userId: agent._id,
      demandeId: demande._id,
      type: 'DEMANDE_RECUE',
      titre: 'Nouvelle demande à traiter',
      message: `Une nouvelle demande de ${docType.nom} (${demande.reference}) a été soumise dans votre service.`,
      donnees: { reference: demande.reference, statut: demande.statut }
    }));
  });

  // Ajouter les notifs admins
  admins.forEach(admin => {
    notificationsPromises.push(Notification.create({
      userId: admin._id,
      demandeId: demande._id,
      type: 'DEMANDE_RECUE',
      titre: '🔔 Nouvelle activité système',
      message: `Nouveau dossier déposé : ${demande.reference} (${docType.nom}) par ${req.user.prenom} ${req.user.nom}.`,
      donnees: { reference: demande.reference, statut: demande.statut }
    }));
  });

  // Lancer toutes les notifications et l'audit log en arrière-plan ou attendre si nécessaire
  // Ici on attend pour être sûr que tout est OK avant de répondre
  await Promise.all([
    ...notificationsPromises,
    AuditLog.createLog({
      action: 'CREATION_DEMANDE',
      categorie: 'DEMANDE',
      auteurId: req.user._id,
      auteurEmail: req.user.email,
      auteurRole: req.user.role,
      auteurIp: req.ip,
      cibleType: 'Demande',
      cibleId: demande._id,
      cibleReference: demande.reference,
      description: `Création demande ${docType.code}`
    })
  ]);

  // 9. Audit Log
  await AuditLog.createLog({
    action: 'CREATION_DEMANDE',
    categorie: 'DEMANDE',
    auteurId: req.user._id,
    auteurEmail: req.user.email,
    auteurRole: req.user.role,
    auteurIp: req.ip,
    cibleType: 'Demande',
    cibleId: demande._id,
    cibleReference: demande.reference,
    description: `Création demande ${docType.code}`
  });

  res.status(201).json({
    success: true,
    message: 'Demande créée avec succès',
    data: {
      reference: demande.reference,
      statut: demande.statut,
      frais: demande.paiement.montant
    }
  });
});

/**
 * Récupérer les demandes du citoyen connecté
 */
exports.getMyDemandes = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const filter = { citoyenId: req.user._id };
  if (req.query.statut) filter.statut = req.query.statut;

  const total = await Demande.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);

  const demandes = await Demande.find(filter)
    .populate('documentTypeId', 'code nom')
    .sort('-dateSoumission')
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
 * Obtenir le détail d'une demande par sa référence
 */
exports.getDemandeByReference = asyncHandler(async (req, res, next) => {
  const demande = await Demande.findOne({ reference: req.params.reference })
    .populate('citoyenId', 'nom prenom email telephone')
    .populate('documentTypeId')
    .populate('agentId', 'nom prenom');

  if (!demande) {
    return next(new AppError('Demande non trouvée', 404));
  }

  // Vérifier permission (citoyen propriétaire ou agent/admin)
  const isOwner = demande.citoyenId._id.toString() === req.user._id.toString();
  const isStaff = ['AGENT_MAIRIE', 'AGENT_JUSTICE', 'SUPERVISEUR', 'ADMIN'].includes(req.user.role);

  if (!isOwner && !isStaff) {
    return next(new AppError('Accès non autorisé', 403));
  }

  res.status(200).json({
    success: true,
    data: demande
  });
});

/**
 * Mettre à jour une demande (si statut permet)
 */
exports.updateDemande = asyncHandler(async (req, res, next) => {
  const demande = await Demande.findOne({ reference: req.params.reference });

  if (!demande) {
    return next(new AppError('Demande non trouvée', 404));
  }

  if (!demande.canBeModifiedBy(req.user)) {
    return next(new AppError('Modification interdite à ce stade du traitement', 403));
  }

  // Mise à jour des données et fichiers
  if (req.body.donnees) demande.donnees = { ...demande.donnees, ...req.body.donnees };
  if (req.body.fichiers) {
    // On ajoute les nouveaux fichiers (gestion simple ici, à affiner selon l'upload)
    demande.fichiers = req.body.fichiers;
  }

  // Si on attendait des compléments, on repasse en EN_ATTENTE
  if (demande.statut === 'DOCUMENTS_MANQUANTS') {
    demande.statut = 'EN_ATTENTE';
    await demande.addToHistorique('COMPLEMENT_FOURNI', req.user, 'Compléments fournis par le citoyen');
  } else {
    await demande.save();
  }

  res.status(200).json({
    success: true,
    message: 'Demande mise à jour',
    data: demande
  });
});

/**
 * Simuler le paiement d'une demande
 */
exports.payerDemande = asyncHandler(async (req, res, next) => {
  const demande = await Demande.findOne({ reference: req.params.reference });

  if (!demande) {
    return next(new AppError('Demande non trouvée', 404));
  }

  if (demande.citoyenId.toString() !== req.user._id.toString()) {
    return next(new AppError('Accès non autorisé', 403));
  }

  if (demande.paiement.statut === 'PAYE') {
    return next(new AppError('Cette demande est déjà payée', 400));
  }

  // Simulation
  demande.paiement.statut = 'PAYE';
  demande.paiement.transactionId = `${demande.paiement.methode}-${Date.now()}`;
  demande.paiement.datePaiement = new Date();
  demande.statut = 'EN_COURS'; // Passe en cours après paiement

  await demande.addToHistorique('PAIEMENT', req.user, `Paiement effectué via ${demande.paiement.methode}`);
  
  await Notification.createForDemande(
    req.user._id,
    demande._id,
    'PAIEMENT_RECU',
    'Paiement reçu',
    `Le paiement pour la demande ${demande.reference} a été confirmé.`,
    { reference: demande.reference, statut: demande.statut }
  );

  await AuditLog.createLog({
    action: 'PAIEMENT',
    categorie: 'PAIEMENT',
    auteurId: req.user._id,
    auteurEmail: req.user.email,
    auteurRole: req.user.role,
    auteurIp: req.ip,
    cibleType: 'Demande',
    cibleId: demande._id,
    cibleReference: demande.reference,
    description: `Paiement demande ${demande.reference} via ${demande.paiement.methode}`
  });

  res.status(200).json({
    success: true,
    message: 'Paiement confirmé',
    transactionId: demande.paiement.transactionId
  });
});
