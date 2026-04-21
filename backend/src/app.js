require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./db/conn");
const { loadData } = require("../controllers/dietController");

const app = express();
const PORT = process.env.PORT || 8000;

connectDB().catch(console.error);

// Logging middleware for Vercel debugging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Root-level health check for Vercel
app.get("/api/health", (req, res) => res.json({ status: "ok", environment: process.env.VERCEL ? "production" : "development" }));

app.use(cors({
    origin: process.env.FRONTEND_URL
        ? [process.env.FRONTEND_URL, "http://localhost:5173"]
        : true,
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());

const apiRouter = express.Router();
apiRouter.get("/ping", (req, res) => res.json({ success: true, message: "pong", timestamp: new Date().toISOString() }));
apiRouter.use("/auth", require("./routes/auth"));
apiRouter.use("/", require("./routes/woLogin"));

// Dual mounting: handle both prefixed and non-prefixed paths from Vercel rewrites
app.use("/api", apiRouter);
app.use("/", apiRouter);

if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Running on ${PORT}`);
        loadData();
    });
}

module.exports = app;