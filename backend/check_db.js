const mongoose = require('mongoose');
const fs = require('fs');

async function check() {
  await mongoose.connect('mongodb://localhost:27017/egov_db');
  
  const docs = await mongoose.connection.db.collection('documenttypes').find().toArray();
  let out = "Document Types Services:\n" + JSON.stringify(docs.map(d => ({nom: d.nom, service: d.service})), null, 2) + "\n\n";
  
  const agents = await mongoose.connection.db.collection('users').find({ role: { $regex: '^AGENT' } }).toArray();
  out += "Agents Services:\n" + JSON.stringify(agents.map(a => ({email: a.email, role: a.role, service: a.service})), null, 2) + "\n\n";
  
  const demandes = await mongoose.connection.db.collection('demandes').find().toArray();
  out += "Demandes Count: " + demandes.length + "\n";
  if(demandes.length > 0) {
      const last = demandes[demandes.length-1];
      out += "Last Demande:\n" + JSON.stringify({id: last._id, typeId: last.documentTypeId, citoyen: last.citoyenId, baseStatut: last.statut, date: last.dateSoumission}, null, 2);
  }
  
  fs.writeFileSync('check_db.log', out);
  process.exit();
}
check();
