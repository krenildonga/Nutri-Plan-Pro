require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./db/conn");
const { loadData } = require("../controllers/dietController");

const app = express();
const PORT = process.env.PORT || 8000;

connectDB().catch(console.error);

// ✅ CORS must be FIRST — before any routes or other middleware
const allowedOrigins = process.env.FRONTEND_URL
    ? [process.env.FRONTEND_URL, "http://localhost:5173"]
    : true;

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Handle preflight OPTIONS requests globally
app.options("*", cors());

// ✅ Body parsers before routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Health checks
app.get("/api/health", (req, res) => res.json({ status: "ok", environment: process.env.VERCEL ? "production" : "development" }));
app.get("/api/ping", (req, res) => res.json({ success: true, message: "pong", timestamp: new Date().toISOString() }));

// ✅ Single clean mounting — only /api prefix (matches vercel.json rewrites)
const apiRouter = express.Router();
apiRouter.use("/auth", require("./routes/auth"));
apiRouter.use("/", require("./routes/woLogin"));

app.use("/api", apiRouter);

if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Running on ${PORT}`);
        loadData();
    });
}

module.exports = app;