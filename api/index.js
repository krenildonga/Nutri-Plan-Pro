const app = require('../backend/src/app');

// Standard Vercel entry point
module.exports = (req, res) => {
  return app(req, res);
};
