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

// Primary Routes - Mounted with /api prefix to match vercel.json rewrites
app.use('/api', require('./routes/woLogin'));
app.use('/api/auth', require('./routes/auth'));

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