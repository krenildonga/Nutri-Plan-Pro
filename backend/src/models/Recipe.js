const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Images: {
        type: String,
        default: ""
    },
    Calories: {
        type: Number,
        required: true
    },
    FatContent: {
        type: Number,
        required: true
    },
    CarbohydrateContent: {
        type: Number,
        required: true
    },
    ProteinContent: {
        type: Number,
        required: true
    },
    Dietary_Type: {
        type: String,
        default: "Veg"
    }
}, { timestamps: true });

// Using 'recipes' as the collection name. If you imported it into a different 
// collection name, you can change it here by adding { collection: 'your_collection_name' }
const Recipe = mongoose.model('Recipe', recipeSchema, 'diet-data');

module.exports = Recipe;
