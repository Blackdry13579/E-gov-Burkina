const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/egov_db').then(async () => {
    try {
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        console.log("COLLECTIONS:", collections.map(c => c.name));
        
        // check each collection for jill
        for (let c of collections) {
            const docs = await db.collection(c.name).find({ $or: [{ nom: /valentine/i }, { prenom: /jill/i }, { email: /jill/i }] }).toArray();
            if (docs.length > 0) {
                console.log(`FOUND IN ${c.name}:`, JSON.stringify(docs, null, 2));
            }
        }
    } catch(e) {
        console.error(e);
    } finally {
        mongoose.disconnect();
    }
});
