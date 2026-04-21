module.exports = (req, res) => {
  res.status(200).json({ 
    status: "ok", 
    type: "standalone_diagnostic",
    environment: process.env.VERCEL ? "production" : "development" 
  });
};
