/**
 * Middleware centralizado para el manejo de errores
 */
const errorHandler = (err, req, res, next) => {
  console.error('[SERVER ERROR]:', err.stack);

  const statusCode = err.statusCode || 500;
  const status = statusCode >= 500 ? 'error' : 'fail';

  res.status(statusCode).json({
    status,
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
