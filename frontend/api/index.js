let app;
try {
  app = require('../../backend/src/app');
} catch (e) {
  console.error("Failed to load backend from frontend/api/index.js:", e.message);
}

module.exports = (req, res) => {
  if (!app) {
    return res.status(500).json({
      success: false,
      message: "Backend could not be loaded from this location. Checks paths/settings.",
      error: "ROOT_DIRECTORY_MISMATCH"
    });
  }
  try {
    return app(req, res);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Error in backup function",
      error: error.message
    });
  }
};
