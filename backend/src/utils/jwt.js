const jwt = require('jsonwebtoken');

/**
 * Génère un token JWT
 * @param {Object} payload - Données à inclure dans le token
 * @returns {string} Token signé
 */
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

/**
 * Vérifie un token JWT
 * @param {string} token - Token à vérifier
 * @returns {Object} Payload décodé
 * @throws {Error} Si le token est invalide ou expiré
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  generateToken,
  verifyToken
};
