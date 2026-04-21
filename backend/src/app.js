require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./db/conn");
const { loadData } = require("../controllers/dietController");

const app = express();
const PORT = process.env.PORT || 8000;

connectDB().catch(console.error);

app.use(cors({
    origin: process.env.FRONTEND_URL
        ? [process.env.FRONTEND_URL, "http://localhost:5173"]
        : true,
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => res.send("API active"));

app.use("/api", require("./routes/woLogin"));
app.use("/api/auth", require("./routes/auth"));

if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Running on ${PORT}`);
        loadData();
    });
}

module.exports = app;