require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./db/conn');
const { loadData } = require('../controllers/dietController');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.status(201).send("Welcome to Home page");
});

app.use('/', require('./routes/woLogin'));
app.use('/auth', require('./routes/auth'));

// Start Server and Load Data
const startServer = async () => {
    try {
        // 1. Wait for Database Connection
        await connectDB();

        // 2. Load Diet Data (Recipes) into Memory
        // We don't await this so the server can start listening, 
        // but loadData is optimized and will run in background.
        loadData();

        // 3. Start Listening
        app.listen(PORT, () => {
            console.log(`listening to port ${PORT}`);
        });
    } catch (err) {
        console.error("Initialization Failed:", err.message);
        process.exit(1);
    }
};

// Export for Vercel
module.exports = app;

// Only start the server if NOT running on Vercel
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    startServer();
}