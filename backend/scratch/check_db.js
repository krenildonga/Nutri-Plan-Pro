const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const DietHistory = require('../src/models/DietHistory');

async function checkDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const totalCount = await DietHistory.countDocuments({});
        console.log("Total records in collection:", totalCount);

        const userCounts = await DietHistory.aggregate([
            { $group: { _id: "$userId", count: { $sum: 1 } } }
        ]);
        console.log("Records per User ID:");
        userCounts.forEach(uc => console.log(`- User ${uc._id}: ${uc.count} records`));

        // Let's check for any records missing userId or personalData
        const missingUserId = await DietHistory.countDocuments({ userId: { $exists: false } });
        const missingPersonalData = await DietHistory.countDocuments({ personalData: { $exists: false } });
        console.log("Records missing userId:", missingUserId);
        console.log("Records missing personalData:", missingPersonalData);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkDB();
