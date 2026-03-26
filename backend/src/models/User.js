const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

/**
 * Schéma Utilisateur (Citoyens, Agents, Admins)
 */
const userSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, 'Le nom est obligatoire'],
      trim: true,
      minlength: [2, 'Le nom doit avoir au moins 2 caractères'],
      maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
    },
    prenom: {
      type: String,
      required: [true, 'Le prénom est obligatoire'],
      trim: true,
      minlength: [2, 'Le prénom doit avoir au moins 2 caractères'],
      maxlength: [50, 'Le prénom ne peut pas dépasser 50 caractères']
    },
    email: {
      type: String,
      required: [true, "L'email est obligatoire"],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Veuillez fournir un email valide']
    },
    password: {
      type: String,
      required: [true, 'Le mot de passe est obligatoire'],
      minlength: [6, 'Le mot de passe doit avoir au moins 6 caractères'],
      select: false
    },
    telephone: {
      type: String,
      required: [true, 'Le numéro de téléphone est obligatoire'],
      match: [/^\d{8,15}$/, 'Format de téléphone invalide (8 à 15 chiffres)']
    },
    role: {
      type: String,
      enum: ['CITOYEN', 'AGENT_MAIRIE', 'AGENT_JUSTICE', 'SUPERVISEUR', 'ADMIN'],
      default: 'CITOYEN'
    },
    service: {
      type: String,
      enum: ['mairie', 'justice'],
      required: [
        function () {
          return this.role && (this.role.startsWith('AGENT_') || this.role === 'SUPERVISEUR');
        },
        'Le service est obligatoire pour les agents et superviseurs'
      ]
    },
    isActive: {
      type: Boolean,
      default: true
    },
    photo: String,
    dateNaissance: String,
    lieuNaissance: String,
    adresse: String,
    matricule: {
      type: String,
      unique: true,
      sparse: true,
      index: true
    },
    // PIN Admin pour la double authentification
    adminPin: {
      type: String,
      select: false,
      default: null,
    },
    adminPinExpiry: {
      type: Date,
      select: false,
      default: null,
    },
    adminPinAttempts: {
      type: Number,
      default: 0,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false
    },
    passwordResetExpires: {
      type: Date,
      select: false
    },
    passwordChangedAt: Date
  },
  {
    timestamps: true
  }
);

// Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ service: 1 });
userSchema.index({ isActive: 1 });

/**
 * Hook pre-save pour hacher le mot de passe
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

/**
 * Compare le mot de passe fourni avec le mot de passe haché
 * @param {string} candidatePassword 
 * @returns {Promise<boolean>}
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Génère un token de réinitialisation de mot de passe
 * @returns {string} Token brut
 */
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

/**
 * Trouve un utilisateur par email et inclut le mot de passe
 * @param {string} email 
 * @returns {Query}
 */
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email }).select('+password');
};

const User = mongoose.model('User', userSchema);

module.exports = User;
