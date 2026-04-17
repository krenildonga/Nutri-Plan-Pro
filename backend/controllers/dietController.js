const createKDTree = require('static-kdtree');
const Recipe = require('../src/models/Recipe');
const DietHistory = require('../src/models/DietHistoty');

let recipes = [];
let kdTree = null;
let isLoaded = false;
let isLoading = false;

const loadData = async () => {
    try {
        if (isLoaded) return;
        if (isLoading) return; // Avoid multiple loads

        isLoading = true;
        console.log("Loading diet data (recipes) from MongoDB...");

        const allRecipes = await Recipe.find({});
        
        if (!allRecipes || allRecipes.length === 0) {
            console.warn("No recipes found in MongoDB collection.");
            isLoading = false;
            return;
        }

        const results = allRecipes.map(recipe => [
            recipe.Name || "Unnamed Recipe",
            recipe.Images || "",
            parseFloat(recipe.Calories) || 0,
            parseFloat(recipe.FatContent) || 0,
            parseFloat(recipe.CarbohydrateContent) || 0,
            parseFloat(recipe.ProteinContent) || 0,
            recipe.Dietary_Type || "Veg"
        ]);

        recipes = results;
        console.log(`Loaded ${recipes.length} recipes from MongoDB. Building KD-Tree...`);

        // Build KD-Tree on Calories, Fat, Carb, Protein (Indices 2, 3, 4, 5)
        const points = recipes.map(r => [r[2], r[3], r[4], r[5]]);
        kdTree = createKDTree(points);

        isLoaded = true;
        isLoading = false;
        console.log("KD-Tree built successfully.");
    } catch (err) {
        console.error("Error loading data from MongoDB:", err);
        isLoading = false;
        throw err;
    }
};

const getRecommendation = async (req, res) => {
    try {
        if (!isLoaded) {
            if (!isLoading) {
                await loadData();
            } else {
                // Wait for loading if already in progress (simple poll)
                while (isLoading) {
                    await new Promise(r => setTimeout(r, 500));
                }
            }
        }

        const { age, height, weight, gender, phyAct, goal, meals_per_day, dietaryPreference } = req.body;

        // Check for existing diet history to enforce "minimum one change" requirement
        const lastDiet = await DietHistory.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
        
        if (lastDiet) {
            const lastData = lastDiet.personalData;
            const isIdentical = 
                lastData.age === parseFloat(age) &&
                lastData.height === parseFloat(height) &&
                lastData.weight === parseFloat(weight) &&
                lastData.gender === gender &&
                lastData.phyAct === parseInt(phyAct) &&
                lastData.goal === goal &&
                lastData.meals_per_day === parseInt(meals_per_day);

            if (isIdentical) {
                return res.status(400).json({ 
                    success: false, 
                    error: "You have already generated a diet plan with these exact values. Please change at least one value (e.g., weight, activity level, or goal) to receive a new recommendation." 
                });
            }
        }

        // Safety check for weight, height, age
        const weightVal = parseFloat(weight) || 70;
        const heightVal = parseFloat(height) || 170;
        const ageVal = parseFloat(age) || 25;
        const mealsCount = parseInt(meals_per_day) || 3;

        const bmi = (weightVal * 10000) / (heightVal * heightVal);

        let bmr;
        if (gender === 'female') {
            bmr = 447.593 + (9.247 * weightVal) + (3.098 * heightVal) - (4.330 * ageVal);
        } else {
            bmr = 88.362 + (13.397 * weightVal) + (4.799 * heightVal) - (5.677 * ageVal);
        }

        const phyFactor = [1.2, 1.375, 1.55, 1.725, 1.9];
        // Ensure index is within range 0-4
        const actIndex = Math.max(0, Math.min(4, parseInt(phyAct) || 0));
        let tdee = bmr * phyFactor[actIndex];

        if (goal === "Loss Weight") {
            tdee -= 500.0;
        } else if (goal === "Gain Weight") {
            tdee += 850.0;
        }

        const calPerMeal = tdee / mealsCount;


        // query_vec = [cal, 0.2*cal, 0.5*cal, 0.3*cal]
        const queryVec = [calPerMeal, 0.2 * calPerMeal, 0.5 * calPerMeal, 0.3 * calPerMeal];

        // KNN query for top 50 candidates to allow for filtering
        const indices = kdTree.knn(queryVec, 50);
        let recommendedMeals = indices.map(idx => recipes[idx]);

        // Filter based on dietary preference and ensure uniqueness
        if (dietaryPreference === "Veg") {
            recommendedMeals = recommendedMeals.filter(meal => meal[6] === "Veg");
        }

        // Remove duplicates by name
        const uniqueMeals = [];
        const seenNames = new Set();
        for (const meal of recommendedMeals) {
            if (!seenNames.has(meal[0])) {
                uniqueMeals.push(meal);
                seenNames.add(meal[0]);
            }
        }

        // Shuffle the results slightly to provide variety across restarts
        recommendedMeals = uniqueMeals.sort(() => Math.random() - 0.5);

        // Return exactly 10 items (or fewer if not enough after filtering)
        recommendedMeals = recommendedMeals.slice(0, 10);

        // --- AUTOMATIC SAVE TO HISTORY ---
        let wStatus;
        if (bmi < 18.5) wStatus = "Underweight";
        else if (bmi < 25) wStatus = "Normal";
        else if (bmi < 30) wStatus = "Overweight";
        else wStatus = "Obese";

        const personalData = {
            age: ageVal,
            height: heightVal,
            weight: weightVal,
            gender: gender,
            phyAct: actIndex,
            goal: goal,
            meals_per_day: mealsCount,
            wStatus: wStatus,
            bmi: parseFloat(bmi.toFixed(2)),
            bmr: parseFloat(bmr.toFixed(2)),
            required_calories: parseFloat(tdee.toFixed(2))
        };

        // Extract Name, Calories, Fat, Carb, Protein for history (match schema fields: 0, 2, 3, 4, 5)
        const historyMeals = recommendedMeals.map(meal => [
            meal[0], // Name
            meal[2], // Calories
            meal[3], // Fat
            meal[4], // Carb
            meal[5]  // Protein
        ]);

        const history = new DietHistory({
            userId: req.user._id,
            personalData,
            selectedMeals: historyMeals
        });

        await history.save();
        console.log("Diet plan automatically saved to history for user:", req.user._id);
        // ---------------------------------

        res.status(201).json({
            success: true,
            data: req.body,
            calvalues: [
                parseFloat(bmi.toFixed(2)),
                parseFloat(bmr.toFixed(2)),
                parseFloat(tdee.toFixed(2))
            ],
            meals: recommendedMeals,
            mealsperday: parseInt(meals_per_day),
            goal: goal
        });

    } catch (err) {
        console.error("Recommendation Error:", err);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

module.exports = { getRecommendation, loadData };
