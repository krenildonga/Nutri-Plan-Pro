const mongoose = require('mongoose');

// Use environment variable for MongoDB URI, with a local fallback for development
const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/nutri_plan_pro';

const connectDB = async () => {
    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 30000, // Increase timeout to 30s
            socketTimeoutMS: 45000,          // Increase socket timeout for large data
        });
        console.log("connection successfull!");
        console.log(`Connected to: ${uri.includes('cluster') ? 'Remote/Atlas DB' : 'Local DB'}`);
    } catch (err) {
        console.log("connection failed!");
        console.error(err.message);
        process.exit(1); // Exit process if DB connection fails
    }
};

module.exports = connectDB;