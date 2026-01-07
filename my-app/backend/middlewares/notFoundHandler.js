const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    message: `Route ${req.method} ${req.originalUrl} not found`,
    success: false,
    timestamp: new Date().toISOString()
  });
};

module.exports = notFoundHandler;