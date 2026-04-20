const errorMiddleware = (err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ message: 'Server Error', error: process.env.NODE_ENV === 'development' ? err.message : undefined });
};

module.exports = errorMiddleware;