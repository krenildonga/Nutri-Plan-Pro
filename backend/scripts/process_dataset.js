const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Keywords moved from dietController.js
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

const inputPath = path.join(__dirname, '../src/data/newbase_11_04.csv');
const outputPath = path.join(__dirname, '../src/data/newbase_dietary.csv');

console.log('Starting data transformation...');
let count = 0;

const writeStream = fs.createWriteStream(outputPath);
let headerWritten = false;

fs.createReadStream(inputPath)
    .pipe(csv())
    .on('data', (row) => {
        if (checkIsNonFood(row.Name || "")) {
            return; // Skip non-food items
        }

        if (!headerWritten) {
            const headers = Object.keys(row).join(',') + ',Dietary_Type\n';
            writeStream.write(headers);
            headerWritten = true;
        }

        const isNonVeg = checkIsNonVeg(row.Name || "", row.RecipeIngredientParts || "");
        row.Dietary_Type = isNonVeg ? 'Non-Veg' : 'Veg';

        // Escape quotes in values for CSV safety
        const values = Object.values(row).map(val => {
            const str = String(val).replace(/"/g, '""');
            return `"${str}"`;
        });
        writeStream.write(values.join(',') + '\n');
        
        count++;
        if (count % 10000 === 0) console.log(`Processed ${count} rows...`);
    })
    .on('end', () => {
        writeStream.end();
        console.log(`Success! Processed ${count} rows.`);
        console.log(`Output saved to: ${outputPath}`);
    })
    .on('error', (err) => {
        console.error('Error processing CSV:', err);
    });
