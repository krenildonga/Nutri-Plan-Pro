const mongoose = require("mongoose");

// MongoDB URI from environment variable, fallback for local development
const uri =
    process.env.MONGO_URI ||
    "mongodb://localhost:27017/nutri_plan_pro";

let connectionPromise = null;

const connectDB = async () => {
    try {
        // 1. If already connected, reuse existing connection
        if (mongoose.connection.readyState === 1) {
            console.log("Using existing MongoDB connection.");
            return mongoose.connection;
        }

        // 2. If connection is in progress, wait for it
        if (connectionPromise) {
            console.log("Waiting for existing MongoDB connection...");
            return connectionPromise;
        }

        // 3. Start new connection
        console.log("Initiating new MongoDB connection...");

        const maskedUri = (uri || "").replace(/\/\/.*@/, "//****:****@");
        console.log(`Connecting to: ${maskedUri}`);

        connectionPromise = mongoose
            .connect(uri, {
                serverSelectionTimeoutMS: 30000,
                socketTimeoutMS: 45000,
                maxPoolSize: 10
            })
            .then((conn) => {
                console.log("MongoDB connected successfully.");
                return conn;
            })
            .catch((err) => {
                connectionPromise = null; // allow retry
                console.error("MongoDB connection failed:", err.message);
                throw err;
            });

        return connectionPromise;
    } catch (error) {
        console.error("Database connection error:", error.message);
        throw error;
    }
};

module.exports = connectDB;