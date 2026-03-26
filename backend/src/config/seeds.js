const DocumentType = require('../models/DocumentType');
const User = require('../models/User');
const logger = require('../utils/logger');

const documentTypes = [
  {
    code: 'NAISSANCE',
    nom: 'Extrait acte de naissance',
    description: 'Document officiel attestant de la naissance d\'un citoyen.',
    categorie: 'ETAT_CIVIL',
    service: 'mairie',
    frais: 300,
    delaiJours: 2,
    ordreAffichage: 1,
    champsSpecifiques: [
      { nom: 'nomPere', label: 'Nom du père', type: 'text', obligatoire: true },
      { nom: 'prenomPere', label: 'Prénom du père', type: 'text', obligatoire: true },
      { nom: 'nomMere', label: 'Nom de la mère', type: 'text', obligatoire: true },
      { nom: 'prenomMere', label: 'Prénom de la mère', type: 'text', obligatoire: true },
      { nom: 'maternite', label: 'Maternité / Lieu de naissance', type: 'text', obligatoire: true },
      { nom: 'typeCopie', label: 'Type de copie', type: 'select', obligatoire: true, options: ['Extrait simple', 'Copie intégrale'] }
    ],
    justificatifs: [
      { code: 'ANCIEN_EXTRAIT', nom: 'Ancien Extrait de Naissance', description: 'Obligatoire', obligatoire: true }
    ]
  },
  {
    code: 'CASIER',
    nom: 'Casier judiciaire B3',
    description: 'Extrait du casier judiciaire bulletin n°3.',
    categorie: 'JUDICIAIRE',
    service: 'justice',
    frais: 750,
    delaiJours: 2,
    ordreAffichage: 2,
    champsSpecifiques: [
      { nom: 'nip', label: 'NIP', type: 'text', obligatoire: false },
      { nom: 'usage', label: 'Usage du casier', type: 'select', obligatoire: true, options: ['Emploi', 'Concours', 'Voyage', 'Études', 'Mariage', 'Autre'] }
    ],
    justificatifs: [
      { code: 'EXTRAIT_NAISSANCE', nom: 'Extrait de Naissance', description: 'Obligatoire', obligatoire: true },
      { code: 'CNIB', nom: 'CNIB', description: 'Scan Recto/Verso', obligatoire: true }
    ]
  },
  {
    code: 'NATIONALITE',
    nom: 'Certificat de nationalité',
    description: 'Document attestant de la nationalité burkinabè.',
    categorie: 'JUDICIAIRE',
    service: 'justice',
    frais: 500,
    delaiJours: 5,
    ordreAffichage: 3,
    champsSpecifiques: [
      { nom: 'modeObtention', label: 'Mode d\'obtention', type: 'select', obligatoire: true, options: ['Né au Burkina', 'Par filiation', 'Par mariage', 'Naturalisation'] },
      { nom: 'genre', label: 'Genre', type: 'select', obligatoire: true, options: ['Masculin', 'Féminin'] },
      { nom: 'nomPere', label: 'Nom du père', type: 'text', obligatoire: true },
      { nom: 'prenomPere', label: 'Prénom du père', type: 'text', obligatoire: true },
      { nom: 'lieuNaissancePere', label: 'Lieu de naissance du père', type: 'text', obligatoire: true },
      { nom: 'nomMere', label: 'Nom de la mère', type: 'text', obligatoire: true },
      { nom: 'prenomMere', label: 'Prénom de la mère', type: 'text', obligatoire: true },
      { nom: 'lieuNaissanceMere', label: 'Lieu de naissance de la mère', type: 'text', obligatoire: true }
    ],
    justificatifs: [
      { code: 'ACTE_PARENT', nom: 'Extrait de naissance (Père ou Mère)', description: 'Obligatoire', obligatoire: true },
      { code: 'ACTE_DEMANDEUR', nom: 'Extrait de naissance (Demandeur)', description: 'Obligatoire', obligatoire: true }
    ]
  }
];

/**
 * Seed / synchronise les types de documents officiels
 */
const seedDocuments = async () => {
  try {
    // Supprimer les types non officiels (MARIAGE, DECES, CNIB, PERMIS, etc.)
    const codesOfficiels = documentTypes.map(d => d.code);
    await DocumentType.deleteMany({ code: { $nin: codesOfficiels } });

    for (const docType of documentTypes) {
      await DocumentType.findOneAndUpdate(
        { code: docType.code },
        {
          $set: {
            nom: docType.nom,
            description: docType.description,
            categorie: docType.categorie,
            service: docType.service,
            frais: docType.frais,
            delaiJours: docType.delaiJours,
            ordreAffichage: docType.ordreAffichage,
            justificatifs: docType.justificatifs,
            champsSpecifiques: docType.champsSpecifiques
          }
        },
        { upsert: true, new: true }
      );
    }
    logger.info('✅ Catalogue officiel synchronisé : Mairie (Naissance) + Justice (Casier, Nationalité)');

    // === SEED UTILISATEURS PAR DÉFAUT ===
    const defaultUsers = [
      {
        nom: 'Administrateur',
        prenom: 'Système',
        email: 'admin@egov.bf',
        password: 'admin123@BF',
        role: 'ADMIN',
        isActive: true
      },
      {
        nom: 'Agent',
        prenom: 'Mairie',
        email: 'agent.mairie@egov.bf',
        password: 'agent123@BF',
        role: 'AGENT',
        service: 'mairie',
        isActive: true
      },
      {
        nom: 'Agent',
        prenom: 'Justice',
        email: 'agent.justice@egov.bf',
        password: 'agent123@BF',
        role: 'AGENT',
        service: 'justice',
        isActive: true
      }
    ];

    for (const u of defaultUsers) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        await User.create(u);
        logger.info(`👤 Utilisateur par défaut créé : ${u.email}`);
      }
    }
  } catch (error) {
    logger.error(`Erreur synchronisation catalogue/users : ${error.message}`);
  }
};

module.exports = seedDocuments;
