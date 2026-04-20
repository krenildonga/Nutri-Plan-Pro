const mongoose = require('mongoose');

// Use environment variable for MongoDB URI, with a local fallback for development
const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/nutri_plan_pro';

let connectionPromise = null;

const connectDB = async () => {
    // 1. If already connected, reuse the connection
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    // 2. If a connection is already in progress, wait for it
    if (connectionPromise) {
        console.log("Waiting for existing connection attempt to complete...");
        return connectionPromise;
    }

    // 3. Otherwise, initiate a new connection
    console.log("Initiating new database connection...");

    // Safety check: Log masked URI to confirm it's loading the correct env var
    const maskedUri = uri.replace(/\/\/.*@/, "//****:****@");
    console.log(`Backend is attempting to connect to: ${maskedUri}`);

    connectionPromise = mongoose.connect(uri, {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
    }).then((conn) => {
        console.log("Database connection successful!");
        console.log(`Connected to: ${uri.includes('cluster') ? 'Remote/Atlas DB' : 'Local DB'}`);
        return conn;
    }).catch((err) => {
        connectionPromise = null; // Clear promise on failure to allow retries
        console.error("Database connection failed!");
        console.error("Error Detail:", err.message);

        if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
            throw err;
        } else {
            process.exit(1);
        }
    });

    return connectionPromise;
};

module.exports = connectDB;