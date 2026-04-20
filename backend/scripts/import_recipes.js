const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const Recipe = require('../src/models/Recipe');

const MONGO_URI = process.env.MONGO_URI;
const CSV_FILE_PATH = path.join(__dirname, '../src/data/newbase_11_04.csv');

const NON_VEG_KEYWORDS = [
    'chicken', 'turkey', 'duck', 'goose', 'quail', 'pheasant', 'hen',
    'beef', 'pork', 'mutton', 'lamb', 'veal', 'venison', 'bison', 'rabbit', 'ribs', 
    'steak', 'meat', 'meatball', 'brisket', 'jerky', 'bacon', 'ham', 'prosciutto', 
    'pepperoni', 'salami', 'sausage', 'frankfurter', 'hot dog', 'hotdog', 'wurst', 
    'chorizo', 'pastrami', 'corned beef', 'meatloaf', 'burger', 'patty',
    'fish', 'salmon', 'tuna', 'tilapia', 'cod', 'trout', 'halibut', 'shrimp', 'prawn', 
    'crab', 'lobster', 'mussel', 'clam', 'oyster', 'scallop', 'squid', 'calamari', 
    'octopus', 'seafood', 'anchovies', 'sardine', 'haddock', 'catfish', 'snapper',
    'egg', 'gelatin', 'lard', 'suet', 'anchovy'
];

const NON_FOOD_KEYWORDS = [
    'paint', 'soap', 'glue', 'scrub', 'mask', 'cleaner', 'lotion', 'balm', 'clay', 
    'dough', 'laundry', 'detergent', 'varnish', 'polish', 'wax', 'dye', 'shampoo', 
    'conditioner', 'remedy', 'salve', 'ointment', 'poison', 'toxic', 'non-edible',
    'craft', 'slime', 'bubbl', 'paste'
];

const checkIsNonVeg = (name, ingredients) => {
    const combined = (name + " " + ingredients).toLowerCase();
    return NON_VEG_KEYWORDS.some(keyword => combined.includes(keyword));
};

const checkIsNonFood = (name) => {
    const lowerName = name.toLowerCase();
    return NON_FOOD_KEYWORDS.some(keyword => lowerName.includes(keyword));
};

async function importData() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB.");

        console.log("Clearing existing recipes...");
        await Recipe.deleteMany({});
        console.log("Collection cleared.");

        let count = 0;
        let batch = [];
        const BATCH_SIZE = 500;

        console.log(`Starting import from ${CSV_FILE_PATH}...`);

        const stream = fs.createReadStream(CSV_FILE_PATH)
            .pipe(csv());

        for await (const row of stream) {
            const name = row.Name || "";
            const ingredients = row.RecipeIngredientParts || "";

            if (checkIsNonFood(name)) continue;

            const isNonVeg = checkIsNonVeg(name, ingredients);
            
            const recipeData = {
                Name: name,
                Images: row.Images || "",
                Calories: parseFloat(row.Calories) || 0,
                FatContent: parseFloat(row.FatContent) || 0,
                CarbohydrateContent: parseFloat(row.CarbohydrateContent) || 0,
                ProteinContent: parseFloat(row.ProteinContent) || 0,
                Dietary_Type: isNonVeg ? 'Non-Veg' : 'Veg'
            };

            batch.push(recipeData);

            if (batch.length >= BATCH_SIZE) {
                await Recipe.insertMany(batch);
                count += batch.length;
                batch = [];
                if (count % 5000 === 0) {
                    console.log(`Imported ${count} recipes...`);
                }
            }
        }

        if (batch.length > 0) {
            await Recipe.insertMany(batch);
            count += batch.length;
        }

        console.log(`Successfully imported ${count} recipes!`);
        process.exit(0);
    } catch (err) {
        console.error("Import failed:", err);
        process.exit(1);
    }
}

importData();
