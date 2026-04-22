const mongoose = require("mongoose");
const config = require("../config");

// MongoDB URI from environment variable
const uri = config.mongoUri;

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
                maxPoolSize: 10,
                bufferCommands: true,
                autoIndex: true,
                bufferTimeoutMS: 30000
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