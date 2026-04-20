const Recipe = require('../src/models/Recipe');
const DietHistory = require('../src/models/DietHistory');

let recipesData = [];

// Load data into memory for faster searching
const loadData = async () => {
    try {
        console.log("Loading diet data into memory...");
        recipesData = await Recipe.find({});
        console.log(`Successfully loaded ${recipesData.length} recipes into memory.`);
    } catch (err) {
        console.error("Error loading recipes into memory:", err.message);
    }
};

const getRecommendation = async (req, res) => {
    try {
        const { age, height, weight, gender, phyAct, goal, meals_per_day, dietaryPreference } = req.body;

        // 1. Basic Calculations
        const bmi = ((weight / (height * height)) * 10000).toFixed(2);
        
        let bmr;
        if (gender === 'male') {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }

        // Activity multipliers based on index 0-4
        const actMultipliers = [1.2, 1.375, 1.55, 1.725, 1.9];
        const activityMultiplier = actMultipliers[phyAct] || 1.2;
        
        let maintenanceCalories = bmr * activityMultiplier;
        let targetCalories;

        if (goal === "Loss Weight") {
            targetCalories = maintenanceCalories - 500;
        } else if (goal === "Gain Weight") {
            targetCalories = maintenanceCalories + 500;
        } else {
            targetCalories = maintenanceCalories;
        }

        targetCalories = Math.round(targetCalories);

        // 2. Determine Weight Status
        let wStatus = "Analyzed"; // Default fallback
        if (bmi < 18.5) wStatus = "Under Weight";
        else if (bmi >= 18.5 && bmi < 25) wStatus = "Optimal Range";
        else if (bmi >= 25 && bmi < 30) wStatus = "Above Range (Overweight)";
        else if (bmi >= 30) wStatus = "Above Range (Obese)";
        else wStatus = "Analyzing..."; // For cases like NaN

        // 3. Filter Recipes
        // Ensure data is loaded
        if (recipesData.length === 0) {
            recipesData = await Recipe.find({});
        }

        const filteredRecipes = recipesData.filter(recipe => {
            const matchesDiet = recipe.Dietary_Type === dietaryPreference;
            return matchesDiet;
        });

        // 4. Recommendation Logic (Simplified: Pick random appropriate meals)
        // Ideally we'd optimize for the targetCalories, but here we just shuffle and pick
        const totalMealsNeeded = parseInt(meals_per_day) || 3;
        const shuffled = [...filteredRecipes].sort(() => 0.5 - Math.random());
        
        // Pick top N meals that satisfy caloric distribution (roughly)
        // Here we just provide a good variety of meals from the shuffled list
        const recommendations = shuffled.slice(0, 50).map(recipe => [
            recipe.Name,
            recipe.Images || "",
            recipe.Calories,
            recipe.FatContent,
            recipe.CarbohydrateContent,
            recipe.ProteinContent
        ]);

        // 5. Automatic Save to History
        if (req.user && req.user._id) {
            try {
                const selectedForHistory = recommendations.slice(0, totalMealsNeeded).map(meal => ({
                    name: meal[0],
                    image: meal[1],
                    calories: meal[2],
                    fat: meal[3],
                    carbohydrates: meal[4],
                    protein: meal[5]
                }));

                const history = new DietHistory({
                    userId: req.user._id,
                    personalData: {
                        age: parseInt(age),
                        height: parseInt(height),
                        weight: parseInt(weight),
                        gender: gender, 
                        phyAct: parseInt(phyAct), 
                        goal, 
                        meals_per_day: totalMealsNeeded,
                        dietaryPreference,
                        wStatus,
                        bmi: parseFloat(bmi),
                        bmr: Math.round(bmr),
                        required_calories: targetCalories
                    },
                    selectedMeals: selectedForHistory
                });

                await history.save();
                const totalHistory = await DietHistory.countDocuments({});
                console.log(`[DB-TRACE] Diet auto-saved for user: ${req.user._id} (ID: ${history._id})`);
                console.log(`[DB-REPORT] Total History Records in Database: ${totalHistory}`);
                console.log(`[AUTO-SAVE SUCCESS] Generated diet saved for user: ${req.user._id}. Meals: ${history.selectedMeals.length}, Calories: ${history.personalData.required_calories}`);
            } catch (saveErr) {
                console.error("[AUTO-SAVE ERROR] Database persistence failed:", saveErr.message);
                if (saveErr.errors) {
                    Object.keys(saveErr.errors).forEach(key => {
                        console.error(`- Field '${key}': ${saveErr.errors[key].message}`);
                    });
                }
            }
        }

        res.status(200).json({
            success: true,
            calvalues: [bmi, Math.round(bmr), targetCalories],
            wStatus,
            mealsperday: totalMealsNeeded,
            goal,
            meals: recommendations
        });

    } catch (err) {
        console.error("Recommendation Error:", err.message);
        res.status(500).json({ success: false, error: "Calculation failed" });
    }
};

module.exports = { loadData, getRecommendation };
