module.exports = (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: "pong from standalone ping", 
    timestamp: new Date().toISOString() 
  });
};
