const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function listCollections() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Collections in database:");
        collections.forEach(c => console.log(`- ${c.name}`));
        
        // Count in each related collection
        for (let c of collections) {
            const count = await mongoose.connection.db.collection(c.name).countDocuments();
            console.log(`  Records in ${c.name}: ${count}`);
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

listCollections();
