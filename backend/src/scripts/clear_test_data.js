require('dotenv').config();
const mongoose = require('mongoose');
const Demande = require('../models/Demande');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');
const logger = require('../utils/logger');

const clearTestData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('🚀 Connexion DB pour nettoyage...');

    // 1. Supprimer les demandes
    const resDemandes = await Demande.deleteMany({});
    logger.info(`✅ ${resDemandes.deletedCount} demandes supprimées.`);

    // 2. Supprimer les notifications
    const resNotifications = await Notification.deleteMany({});
    logger.info(`✅ ${resNotifications.deletedCount} notifications supprimées.`);

    // 3. Supprimer les logs d'audit
    const resLogs = await AuditLog.deleteMany({});
    logger.info(`✅ ${resLogs.deletedCount} logs d'audit supprimés.`);

    logger.info('✨ Nettoyage terminé avec succès.');
    process.exit(0);
  } catch (error) {
    logger.error(`❌ Erreur lors du nettoyage : ${error.message}`);
    process.exit(1);
  }
};

clearTestData();
