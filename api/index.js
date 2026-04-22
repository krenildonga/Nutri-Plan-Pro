const app = require('../backend/src/app');
const connectDB = require('../backend/src/db/conn');

module.exports = async (req, res) => {
  try {
    // Ensure DB is connected before processing request
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error("Vercel Backend Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error in Vercel Function",
      error: error.message
    });
  }
};