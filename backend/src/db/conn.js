const mongoose = require('mongoose');

// Use environment variable for MongoDB URI, with a local fallback for development
const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/nutri_plan_pro';

const connectDB = async () => {
    // If the database is already connected, reuse the connection (Safe for serverless)
    if (mongoose.connection.readyState === 1) {
        console.log("Database connection already exists, reusing connection");
        return;
    }

    try {
        console.log("Attempting to connect to Database...");
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 30000, 
            socketTimeoutMS: 45000,          
        });
        console.log("Database connection successful!");
        console.log(`Connected to: ${uri.includes('cluster') ? 'Remote/Atlas DB' : 'Local DB'}`);
    } catch (err) {
        console.error("Database connection failed!");
        console.error("Error Detail:", err.message);
        
        // On Vercel, we throw instead of exit to let the runtime handle the fail gracefully
        if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
            throw err;
        } else {
            process.exit(1);
        }
    }
};

module.exports = connectDB;