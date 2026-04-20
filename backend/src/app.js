require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./db/conn');
const { loadData } = require('../controllers/dietController');

const app = express();
const PORT = process.env.PORT || 8000;

// Initialize Database Connection (Critical for Vercel/Production)
connectDB().catch(err => {
    console.error("Critical: Initial DB connection failed during startup.");
    console.error(err);
});

// Database Readiness Middleware (Ensures connection before processing)
const ensureDbConnected = async (req, res, next) => {
    const mongoose = require('mongoose');
    try {
        if (mongoose.connection.readyState !== 1) {
            console.log("Database not ready. Attempting to connect/wait...");
            await connectDB();
        }
        next();
    } catch (err) {
        return res.status(503).json({
            success: false,
            error: "Database connection failed. Please check server logs and MongoDB Atlas whitelist.",
            readyState: mongoose.connection.readyState,
            detail: err.message
        });
    }
};

// Middleware
app.use(cors({
    // In production/Vercel, we often want to allow all origins from our own domain 
    // or set it to true if FRONTEND_URL is not yet configured.
    origin: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL, "http://localhost:5173"] : true,
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// Legacy Health Check
app.get('/', (req, res) => {
    res.status(200).send("API is active");
});

// Diagnostic Route for Deployment Troubleshooting
app.get('/api/auth/status', (req, res) => {
    const mongoose = require('mongoose');
    res.status(200).json({
        success: true,
        status: "Backend is running",
        databaseConnected: mongoose.connection.readyState === 1,
        databaseState: mongoose.connection.readyState, // 0: disc, 1: conn, 2: connecting, 3: disconnecting
        env: {
            SECRET_KEY: process.env.SECRET_KEY ? "Defined" : "MISSING",
            MONGO_URI: process.env.MONGO_URI ? "Defined" : "MISSING",
            FRONTEND_URL: process.env.FRONTEND_URL ? "Defined" : "MISSING",
            VERCEL: process.env.VERCEL ? "Yes" : "No"
        }
    });
});

// Primary Routes - Mounted with /api prefix to match vercel.json rewrites
app.use('/api', ensureDbConnected, require('./routes/woLogin'));
app.use('/api/auth', ensureDbConnected, require('./routes/auth'));

// Secondary Routes - Backward compatibility for local development
app.use('/', require('./routes/woLogin'));
app.use('/auth', require('./routes/auth'));

// Start Server (Only for Local Development)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Local server listening on http://localhost:${PORT}`);
        // Load data into memory in background
        loadData();
    });
}

// Export for Vercel Serverless Function runtime
module.exports = app;