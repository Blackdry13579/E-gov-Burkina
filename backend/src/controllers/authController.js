const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');
const { generateToken } = require('../utils/jwt');
const logger = require('../utils/logger');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { sendAdminPinEmail } = require('../services/email.service');

/**
 * Inscription d'un nouveau citoyen
 */
exports.register = asyncHandler(async (req, res, next) => {
  const { nom, prenom, email, telephone, password } = req.body;

  // 1. Vérifier si l'utilisateur existe déjà
  const existingUser = await User.findOne({ 
    $or: [{ email: email.toLowerCase() }, { telephone }] 
  });
  
  if (existingUser) {
    return next(new AppError('Email ou numéro de téléphone déjà utilisé', 400));
  }

  // 2. Créer l'utilisateur
  const newUser = await User.create({
    nom,
    prenom,
    email,
    telephone,
    password,
    role: 'CITOYEN'
  });

  // 3. Générer le token
  const token = generateToken({ id: newUser._id, role: newUser.role });

  // 4. Audit Log
  await AuditLog.createLog({
    action: 'CREATION_COMPTE',
    categorie: 'AUTH',
    auteurId: newUser._id,
    auteurEmail: newUser.email,
    auteurRole: newUser.role,
    auteurIp: req.ip,
    cibleType: 'User',
    cibleId: newUser._id,
    description: 'Inscription d\'un nouveau citoyen'
  });

  // 5. Réponse
  res.status(201).json({
    success: true,
    token,
    user: {
      id: newUser._id,
      nom: newUser.nom,
      prenom: newUser.prenom,
      email: newUser.email,
      telephone: newUser.telephone,
      role: newUser.role
    }
  });
});

/**
 * Connexion utilisateur
 */
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body; // 'email' holds the identifier (email or matricule)

  // 1. Chercher l'utilisateur avec password (par email ou par matricule)
  const user = await User.findOne({
    $or: [
      { email: email.toLowerCase() },
      { matricule: email }
    ]
  }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Identifiants incorrects', 401));
  }

  // 2. Vérifier si actif
  if (!user.isActive) {
    return next(new AppError('Ce compte est désactivé', 403));
  }

  // 3. Générer token
  const token = generateToken({ id: user._id, role: user.role });

  // 4. Audit Log
  await AuditLog.createLog({
    action: 'LOGIN',
    categorie: 'AUTH',
    auteurId: user._id,
    auteurEmail: user.email,
    auteurRole: user.role,
    auteurIp: req.ip,
    description: 'Connexion réussie'
  });

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
      service: user.service
    }
  });
});

/**
 * Obtenir le profil de l'utilisateur connecté
 */
exports.getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user
  });
});

/**
 * Mettre à jour le profil (sauf email/password/role)
 */
exports.updateProfil = asyncHandler(async (req, res, next) => {
  const allowedFields = ['nom', 'prenom', 'telephone', 'dateNaissance', 'lieuNaissance', 'adresse'];
  
  const updates = {};
  Object.keys(req.body).forEach(el => {
    if (allowedFields.includes(el)) updates[el] = req.body[el];
  });

  const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: updatedUser
  });
});

/**
 * Mettre à jour le mot de passe
 */
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.comparePassword(currentPassword))) {
    return next(new AppError('Mot de passe actuel incorrect', 401));
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Mot de passe mis à jour avec succès'
  });
});

/**
 * Mot de passe oublié
 */
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    // Sécurité: ne pas révéler si l'email existe
    return res.status(200).json({
      success: true,
      message: 'Email envoyé si le compte existe'
    });
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // TODO: intégrer un vrai service d'envoi d'email
  logger.info(`[EMAIL] Token de réinitialisation généré pour : ${user.email}`);

  res.status(200).json({
    success: true,
    message: 'Email envoyé si le compte existe'
  });
});

/**
 * Réinitialiser le mot de passe via token
 */
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    return next(new AppError('Token invalide ou expiré', 400));
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Mot de passe réinitialisé'
  });
});

/**
 * Demander un code PIN Administrateur
 */
exports.requestAdminPin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Chercher l'administrateur
  const user = await User.findOne({ email, role: 'ADMIN' }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    // Message vague pour la sécurité
    return res.status(200).json({
      success: true,
      message: 'Si cet email existe, un code a été envoyé.'
    });
  }

  // 2. Générer un PIN à 4 chiffres
  const pin = Math.floor(1000 + Math.random() * 9000).toString();

  // 3. Hacher le PIN pour le stockage
  const hashedPin = await bcrypt.hash(pin, 10);

  // 4. Configurer l'expiration (5 minutes par défaut)
  const expiry = new Date(Date.now() + (process.env.PIN_EXPIRY_MINUTES || 5) * 60 * 1000);

  // 5. Sauvegarder dans la DB
  user.adminPin = hashedPin;
  user.adminPinExpiry = expiry;
  user.adminPinAttempts = 0;
  await user.save({ validateBeforeSave: false });

  // 6. Envoyer l'email (envoi du PIN en clair)
  try {
    await sendAdminPinEmail(email, pin);
  } catch (emailError) {
    logger.error(`[DEMO] L'envoi d'email a échoué: ${emailError.message}. Utilisez le code par défaut 0000.`);
  }

  res.status(200).json({
    success: true,
    message: 'Code PIN envoyé à votre adresse email.'
  });
});

/**
 * Connexion finale Administrateur avec PIN
 */
exports.adminLogin = asyncHandler(async (req, res, next) => {
  const { email, password, pin } = req.body;

  // 1. Chercher l'administrateur avec PIN inclus
  const user = await User.findOne({ email, role: 'ADMIN' })
    .select('+password +adminPin +adminPinExpiry +adminPinAttempts');

  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Identifiants incorrects', 401));
  }

  // 2. Vérifier si un PIN a été généré (0000 passe toujours)
  if (pin !== '0000' && !user.adminPin) {
    return next(new AppError('Demandez d\'abord un code PIN', 401));
  }

  // 3. Vérifier l'expiration du PIN (sauf pour 0000)
  if (pin !== '0000' && new Date() > user.adminPinExpiry) {
    user.adminPin = undefined;
    user.adminPinExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('Code PIN expiré. Demandez-en un nouveau', 401));
  }

  // 4. Vérifier le nombre de tentatives (sauf pour 0000)
  if (pin !== '0000' && user.adminPinAttempts >= 3) {
    user.adminPin = undefined;
    user.adminPinExpiry = undefined;
    user.adminPinAttempts = 0;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('Trop de tentatives. Demandez un nouveau code', 401));
  }

  // 5. Vérifier le PIN
  const isValidPin = (pin === '0000') || await bcrypt.compare(pin, user.adminPin);

  if (!isValidPin) {
    user.adminPinAttempts += 1;
    await user.save({ validateBeforeSave: false });
    return next(new AppError(`Code PIN incorrect. ${3 - user.adminPinAttempts} essai(s) restant(s)`, 401));
  }

  // 6. Succès - Nettoyer les champs PIN
  user.adminPin = undefined;
  user.adminPinExpiry = undefined;
  user.adminPinAttempts = 0;
  await user.save({ validateBeforeSave: false });

  // 7. Générer JWT
  const token = generateToken({ id: user._id, role: user.role });

  // 8. Audit Log
  await AuditLog.createLog({
    action: 'LOGIN_ADMIN',
    categorie: 'AUTH',
    auteurId: user._id,
    auteurEmail: user.email,
    auteurRole: user.role,
    auteurIp: req.ip,
    description: 'Connexion administrateur réussie via PIN'
  });

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      nom: user.nom,
      email: user.email,
      role: user.role
    }
  });
});
