const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    console.log('⏳ Connexion à la base de données...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB.');

    // Vérifier si un admin existe déjà
    const existing = await User.findOne({ role: 'ADMIN' });

    if (existing) {
      console.log('✅ Un administrateur existe déjà :', existing.email);
      process.exit(0);
    }

    // Créer l'administrateur
    const hashedPassword = await bcrypt.hash('AdminEGov2026!', 12);

    await User.create({
      nom: 'Administrateur',
      prenom: 'Système',
      email: 'admin@egov.bf',
      password: hashedPassword,
      telephone: '70000000',
      role: 'ADMIN',
      isActive: true,
    });

    console.log('\n🚀 ADMINISTRATEUR CRÉÉ AVEC SUCCÈS !');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email    : admin@egov.bf');
    console.log('🔑 Password : AdminEGov2026!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️ Veuillez changer le mot de passe après la première connexion.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin :', error);
    process.exit(1);
  }
};

createAdmin();
