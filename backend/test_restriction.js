const mongoose = require('mongoose');
const { getRecommendation } = require('./controllers/dietController');
const DietHistory = require('./src/models/DietHistoty');
const uri = 'mongodb://localhost:27017/nutri_plan_pro';

async function testRestriction() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");

        const dummyUserId = new mongoose.Types.ObjectId();
        const personalData = {
            age: 25,
            height: 175,
            weight: 70,
            gender: 'male',
            phyAct: 1,
            goal: 'Maintenance',
            meals_per_day: 3,
            wStatus: 'Normal',
            bmi: 22.86,
            bmr: 1724,
            required_calories: 2370
        };

        // 1. Save a diet history for the dummy user
        console.log("Saving initial diet history...");
        await DietHistory.create({
            userId: dummyUserId,
            personalData,
            selectedMeals: [['Oatmeal', 300, 10, 50, 15]]
        });

        // 2. Mock request and response for getRecommendation (Identical Data)
        const reqIdentical = {
            user: { _id: dummyUserId },
            body: {
                age: 25,
                height: 175,
                weight: 70,
                gender: 'male',
                phyAct: 1,
                goal: 'Maintenance',
                meals_per_day: 3,
                dietaryPreference: 'Veg'
            }
        };

        let resStatus;
        let resJson;
        const resMock = {
            status: function(s) { resStatus = s; return this; },
            json: function(j) { resJson = j; return this; }
        };

        console.log("Testing recommendation with IDENTICAL data...");
        await getRecommendation(reqIdentical, resMock);

        if (resStatus === 400 && resJson.success === false) {
            console.log("SUCCESS: Correctly blocked identical data.");
        } else {
            console.error("FAILURE: Did not block identical data. Status:", resStatus, "JSON:", resJson);
        }

        // 3. Mock request with CHANGED data
        const reqChanged = {
            user: { _id: dummyUserId },
            body: { ...reqIdentical.body, weight: 71 } // Weight changed by 1kg
        };

        console.log("Testing recommendation with CHANGED data...");
        await getRecommendation(reqChanged, resMock);

        if (resStatus === 201 && resJson.success === true) {
            console.log("SUCCESS: Correctly allowed changed data.");
        } else {
            console.error("FAILURE: Blocked changed data incorrectly. Status:", resStatus, "JSON:", resJson);
        }

        // Cleanup
        await DietHistory.deleteMany({ userId: dummyUserId });
        console.log("Cleanup complete.");
        process.exit(0);
    } catch (err) {
        console.error("Test failed:", err);
        process.exit(1);
    }
}

testRestriction();
