const app = require('../backend/src/app');

module.exports = (req, res) => {
  try {
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