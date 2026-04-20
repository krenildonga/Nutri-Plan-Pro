const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Register',
        required: true
    },
    personalData: {
        age: { type: Number, required: true },
        height: { type: Number, required: true },
        weight: { type: Number, required: true },
        gender: { type: String, required: true },
        phyAct: { type: Number, required: true },
        goal: { type: String, required: true },
        meals_per_day: { type: Number, required: true },
        dietaryPreference: { type: String, required: true },
        wStatus: { type: String, required: true },
        bmi: { type: Number, required: true },
        bmr: { type: Number, required: true },
        required_calories: { type: Number, required: true }
    },
    selectedMeals: [{
        name: { type: String, required: true },
        image: { type: String, default: "" },
        calories: { type: Number, required: true },
        fat: { type: Number, required: true },
        carbohydrates: { type: Number, required: true },
        protein: { type: Number, required: true }
    }]
}, { timestamps: true });

const DietHistory = mongoose.model("DietHistory", historySchema);

module.exports = DietHistory;
