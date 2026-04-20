const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function deleteOldCollection() {
    try {
        console.log("Connecting to:", process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected.");

        const db = mongoose.connection.db;
        
        // 1. Check if it exists
        const collections = await db.listCollections({ name: 'mealhistories' }).toArray();
        if (collections.length > 0) {
            console.log("Found 'mealhistories' collection. Deleting...");
            await db.collection('mealhistories').drop();
            console.log("Successfully deleted 'mealhistories'.");
        } else {
            console.log("'mealhistories' collection not found (maybe already deleted).");
        }

        // 2. Verify diethistories exists and has data
        const newColl = db.collection('diethistories');
        const count = await newColl.countDocuments({});
        console.log(`Verification: 'diethistories' has ${count} records.`);

        process.exit(0);
    } catch (err) {
        console.error("Deletion failed:", err);
        process.exit(1);
    }
}

deleteOldCollection();
