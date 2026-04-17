const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const createKDTree = require('static-kdtree');

let recipes = [];
let kdTree = null;
let isLoaded = false;
let isLoading = false;



const loadData = () => {
    return new Promise((resolve, reject) => {
        if (isLoaded) return resolve();
        if (isLoading) return resolve(); // Avoid multiple loads

        isLoading = true;
        console.log("Loading diet data (recipes) from CSV...");
        // Use an absolute path or relative to THIS file
        const csvFilePath = path.join(__dirname, '../src/data/newbase_dietary.csv');

        const results = [];

        if (!fs.existsSync(csvFilePath)) {
            const error = `CSV file not found at ${csvFilePath}. Please ensure it was copied correctly.`;
            console.error(error);
            isLoading = false;
            return reject(error);
        }

        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (data) => {
                // Columns: ,Name,Images,Calories,FatContent,CarbohydrateContent,ProteinContent,Description...
                // Index mapping in results array:
                // 0: Name
                // 1: Images
                // 2: Calories
                // 3: FatContent
                // 4: CarbohydrateContent
                // 5: ProteinContent
                results.push([
                    data.Name || "Unnamed Recipe",
                    data.Images || "",
                    parseFloat(data.Calories) || 0,
                    parseFloat(data.FatContent) || 0,
                    parseFloat(data.CarbohydrateContent) || 0,
                    parseFloat(data.ProteinContent) || 0,
                    data.Dietary_Type || "Veg"
                ]);
            })
            .on('end', () => {
                recipes = results;
                console.log(`Loaded ${recipes.length} recipes. Building KD-Tree...`);

                // Build KD-Tree on Calories, Fat, Carb, Protein (Indices 2, 3, 4, 5)
                const points = recipes.map(r => [r[2], r[3], r[4], r[5]]);
                kdTree = createKDTree(points);

                isLoaded = true;
                isLoading = false;
                console.log("KD-Tree built successfully.");
                resolve();
            })
            .on('error', (err) => {
                console.error("Error loading CSV:", err);
                isLoading = false;
                reject(err);
            });
    });
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
