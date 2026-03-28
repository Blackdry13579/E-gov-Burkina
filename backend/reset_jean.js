const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost:27017/egov_db').then(async () => {
    try {
        const db = mongoose.connection.db;
        // Nouveau mot de passe super simple: 123456
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);
        
        // Mettre à jour jean ko (jeanko@gmail.com)
        const result = await db.collection('users').updateOne(
            { email: 'jeanko@gmail.com' },
            { $set: { password: hashedPassword } }
        );
        
        console.log("UPDATE_RESULT:", result.modifiedCount);
    } catch(e) {
        console.error(e);
    } finally {
        mongoose.disconnect();
    }
});
