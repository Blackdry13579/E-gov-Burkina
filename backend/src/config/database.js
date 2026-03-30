const mongoose = require('mongoose');
const logger = require('../utils/logger');

/**
 * Connexion à la base de données MongoDB Atlas
 * @async
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    logger.info(`✅ MongoDB connecté : ${conn.connection.host}`);
  } catch (error) {
    logger.error(`❌ Erreur de connexion MongoDB : ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
