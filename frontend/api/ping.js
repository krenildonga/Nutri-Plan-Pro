module.exports = (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: "pong from frontend standalone ping", 
    timestamp: new Date().toISOString() 
  });
};
