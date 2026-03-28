const { body, validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

/**
 * Middleware pour valider les résultats d'express-validator
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => ({
      field: err.param || err.path,
      message: err.msg
    }));
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors: errorMessages
    });
  }
  next();
};

/**
 * Schéma de validation pour l'inscription
 */
const registerSchema = [
  body('nom').trim().notEmpty().withMessage('Le nom est obligatoire'),
  body('prenom').trim().notEmpty().withMessage('Le prénom est obligatoire'),
  body('email').isEmail().withMessage('Email invalide').normalizeEmail(),
  body('telephone')
    .matches(/^[567]\d{7}$/)
    .withMessage('Format téléphone Burkina Faso invalide'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit faire au moins 6 caractères')
];

/**
 * Schéma de validation pour la connexion
 */
const loginSchema = [
  body('email').trim().notEmpty().withMessage('Identifiant ou Email obligatoire'),
  body('password').notEmpty().withMessage('Mot de passe obligatoire')
];

/**
 * Schéma de validation pour la mise à jour du profil
 */
const updateProfilSchema = [
  body('nom').optional().trim().notEmpty(),
  body('prenom').optional().trim().notEmpty(),
  body('telephone').optional().matches(/^[567]\d{7}$/)
];

/**
 * Schéma de validation pour le changement de mot de passe
 */
const updatePasswordSchema = [
  body('currentPassword').notEmpty().withMessage('Mot de passe actuel obligatoire'),
  body('newPassword').isLength({ min: 6 }).withMessage('Nouveau mot de passe min 6 chars')
];

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  updateProfilSchema,
  updatePasswordSchema
};
