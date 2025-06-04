const { isDevelopment } = require('../config');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error(err); // Log error ke konsol server

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    ...(isDevelopment && { stack: err.stack }), // Hanya tampilkan stack trace di development
  });
};

module.exports = errorHandler;