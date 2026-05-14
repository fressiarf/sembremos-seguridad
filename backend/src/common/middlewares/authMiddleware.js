const jwt = require('jsonwebtoken');

/**
 * Middleware de autenticación para rutas protegidas.
 *
 * Extrae el token JWT de la cookie HTTP-Only 'token', verifica su firma
 * e inyecta el payload del usuario en req.user para uso de los controladores.
 *
 * @usage Añadir como middleware en cualquier ruta protegida:
 *   router.get('/ruta-privada', authMiddleware, controlador);
 */
const authMiddleware = (req, res, next) => {
  // 1. Extraer token desde la cookie HTTP-Only
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      status: 'fail',
      message: 'Acceso no autorizado. Por favor, inicie sesión.'
    });
  }

  // 2. Verificar la firma y vigencia del token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Inyectar datos del usuario en el ciclo de la petición
    req.user = {
      id:    decoded.id,
      email: decoded.email,
      role:  decoded.role,
      nivel: decoded.nivel   // 'MSP' | 'MUNI'
    };

    next();

  } catch (error) {
    // Token expirado
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'fail',
        message: 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.'
      });
    }

    // Token manipulado o inválido
    return res.status(401).json({
      status: 'fail',
      message: 'Token inválido. Acceso denegado.'
    });
  }
};

module.exports = authMiddleware;
