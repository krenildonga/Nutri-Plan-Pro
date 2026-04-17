const mongoose = require('mongoose');
const { getRecommendation } = require('./controllers/dietController');
const DietHistory = require('./src/models/DietHistoty');
const uri = 'mongodb://localhost:27017/nutri_plan_pro';

async function verifyAutoSave() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");

        const dummyUserId = new mongoose.Types.ObjectId();
        const initialCount = await DietHistory.countDocuments({ userId: dummyUserId });
        console.log("Initial history count for dummy user:", initialCount);

        // 1. Mock request and response for getRecommendation
        const req = {
            user: { _id: dummyUserId },
            body: {
                age: 30,
                height: 180,
                weight: 75,
                gender: 'male',
                phyAct: 2,
                goal: 'Gain Weight',
                meals_per_day: 4,
                dietaryPreference: 'Veg'
            }
        };

        const resMock = {
            status: function(s) { return this; },
            json: function(j) { return this; }
        };

        console.log("Requesting recommendation (which should trigger auto-save)...");
        await getRecommendation(req, resMock);

        // 2. Check if counts increased
        const finalCount = await DietHistory.countDocuments({ userId: dummyUserId });
        console.log("Final history count for dummy user:", finalCount);

        if (finalCount === initialCount + 1) {
            console.log("SUCCESS: Diet history was automatically saved!");
            
            const savedHistory = await DietHistory.findOne({ userId: dummyUserId });
            console.log("Saved wStatus:", savedHistory.personalData.wStatus);
            console.log("Number of saved meals:", savedHistory.selectedMeals.length);
            
            if (savedHistory.personalData.wStatus && savedHistory.selectedMeals.length === 10) {
                console.log("SUCCESS: Data structure is correct.");
            } else {
                console.error("FAILURE: Data structure is incorrect.");
            }
        } else {
            console.error("FAILURE: Diet history was not saved.");
        }

        // Cleanup
        await DietHistory.deleteMany({ userId: dummyUserId });
        console.log("Cleanup complete.");
        process.exit(0);
    } catch (err) {
        console.error("Verification failed:", err);
        process.exit(1);
    }
}

verifyAutoSave();
