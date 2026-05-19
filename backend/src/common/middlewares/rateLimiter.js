const rateLimit = require('express-rate-limit');

/**
 * Middleware para limitar peticiones de login.
 * Previene ataques de fuerza bruta (Brute Force) o rociado de contraseñas (Password Spraying).
 */
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos de ventana
  max: 5, // Límite de 5 peticiones fallidas/exitosas por IP en esa ventana para esta ruta
  message: {
    status: 'error',
    message: 'Demasiados intentos de inicio de sesión desde esta IP. Por favor, inténtelo de nuevo después de 15 minutos.'
  },
  standardHeaders: true, // Retorna la información en los headers `RateLimit-*`
  legacyHeaders: false, // Deshabilita los headers `X-RateLimit-*`
  
  // Opcional: Solo cuenta las peticiones fallidas si se quisiera,
  // pero para mayor seguridad en sistemas policiales se cuentan todas las peticiones al endpoint.
});

module.exports = { loginRateLimiter };
