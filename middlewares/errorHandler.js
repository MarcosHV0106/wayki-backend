// middlewares/errorHandler.js
module.exports = (err, req, res, next) => {
  console.error('🛑 Error:', err);

  const statusCode = err.status || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    errors: err.errors || null
  });
};
