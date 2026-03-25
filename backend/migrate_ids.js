const mongoose = require('mongoose');

async function migrate() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/egov_db');
    console.log('Connected.');

    const collection = mongoose.connection.db.collection('demandes');
    const demandes = await collection.find({}).toArray();

    let migratedCount = 0;
    for (const d of demandes) {
      let updateNeeded = false;
      const update = { $set: {} };

      // Convert documentTypeId to ObjectId if it's a string
      if (typeof d.documentTypeId === 'string' && d.documentTypeId.length === 24) {
        update.$set.documentTypeId = new mongoose.Types.ObjectId(d.documentTypeId);
        updateNeeded = true;
      }

      // Convert citoyenId to ObjectId if it's a string
      if (typeof d.citoyenId === 'string' && d.citoyenId.length === 24) {
        update.$set.citoyenId = new mongoose.Types.ObjectId(d.citoyenId);
        updateNeeded = true;
      }

      // Convert agentId if exists
      if (d.agentId && typeof d.agentId === 'string' && d.agentId.length === 24) {
        update.$set.agentId = new mongoose.Types.ObjectId(d.agentId);
        updateNeeded = true;
      }

      if (updateNeeded) {
        await collection.updateOne({ _id: d._id }, update);
        migratedCount++;
      }
    }

    console.log(`Migration finished. Migrated ${migratedCount} documents.`);
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
