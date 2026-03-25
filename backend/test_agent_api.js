const mongoose = require('mongoose');
const Demande = require('./src/models/Demande');
const DocumentType = require('./src/models/DocumentType');
const User = require('./src/models/User');

async function test() {
  await mongoose.connect('mongodb://localhost:27017/egov_db');
  
  const agentEmail = 'agent_mairie@egov.bf';
  const agent = await User.findOne({ email: agentEmail });
  
  if (!agent) {
    console.log('Agent not found');
    process.exit();
  }

  console.log('Testing for Agent:', agent.email, '| Service:', agent.service);

  // LOGIQUE DU CONTROLEUR
  const serviceDocs = await DocumentType.find({ service: agent.service }).select('_id');
  const docTypeIds = serviceDocs.map(d => d._id);
  console.log('Step 1 - docTypeIds found:', docTypeIds);

  const filter = { documentTypeId: { $in: docTypeIds } };
  console.log('Step 2 - Filter:', JSON.stringify(filter));

  const count = await Demande.countDocuments(filter);
  console.log('Step 3 - countDocuments:', count);

  const demandes = await Demande.find(filter)
    .populate('citoyenId', 'nom prenom email')
    .populate('documentTypeId', 'code nom service');
    
  console.log('Step 4 - demandes found:', demandes.length);
  if (demandes.length > 0) {
    console.log('First Demande:', {
        ref: demandes[0].reference,
        type: demandes[0].documentTypeId.nom,
        status: demandes[0].statut
    });
  } else {
      const all = await Demande.find();
      console.log('Diagnostic - Total Demandes in DB:', all.length);
      if(all.length > 0) {
          console.log('First Demande in DB docTypeId:', all[0].documentTypeId);
          console.log('Match test manually:', docTypeIds.some(id => id.toString() === all[0].documentTypeId.toString()));
      }
  }

  process.exit();
}
test();
