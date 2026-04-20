// const mongoose = require('mongoose');
// const path = require('path');
// require('dotenv').config({ path: path.join(__dirname, '../.env') });

// async function migrate() {
//     try {
//         console.log("Connecting to:", process.env.MONGO_URI);
//         await mongoose.connect(process.env.MONGO_URI);
//         console.log("Connected.");

//         const db = mongoose.connection.db;
//         const sourceColl = db.collection('mealhistories');
//         const targetColl = db.collection('diethistories');

//         const totalCount = await sourceColl.countDocuments({});
//         console.log(`Source collection 'mealhistories' has ${totalCount} records.`);

//         if (totalCount === 0) {
//             console.log("No records to migrate.");
//             process.exit(0);
//         }

//         const documents = await sourceColl.find({}).toArray();
//         console.log(`Fetched ${documents.length} documents.`);

//         // Insert into new collection
//         const result = await targetColl.insertMany(documents);
//         console.log(`Successfully migrated ${result.insertedCount} records to 'diethistories'.`);

//         // Verify
//         const newCount = await targetColl.countDocuments({});
//         console.log(`Verification: 'diethistories' now has ${newCount} records.`);

//         process.exit(0);
//     } catch (err) {
//         console.error("Migration failed:", err);
//         process.exit(1);
//     }
// }

// migrate();
