const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '2h';

/**
 * Genera un token JWT firmado con los datos de identidad del usuario.
 *
 * @param {Object} user - Objeto usuario proveniente de Sequelize (UsuarioFP o UsuarioLocal).
 * @param {number|string} user.id         - ID único del usuario en la base de datos.
 * @param {string}        user.email      - Email del usuario.
 * @param {string}        user.rol        - Rol del usuario (ej: 'ADMIN_MSP', 'GESTOR_MUNI').
 * @param {string}        nivel           - Nivel de pertenencia ('MSP' | 'MUNI').
 * @returns {string} Token JWT firmado.
 */
const generateToken = (user, nivel) => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET no está definido en las variables de entorno.');
  }

  const payload = {
    id:    user.id,
    email: user.email,
    role:  user.rol,       // Ej: 'ADMIN_MSP', 'GESTOR_MUNI', 'SUPERVISOR'
    nivel: nivel           // 'MSP' (Fuerza Pública) | 'MUNI' (Municipalidad)
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Verifica y decodifica un token JWT.
 * Lanza un error si el token es inválido o ha expirado.
 *
 * @param {string} token - Token JWT a verificar.
 * @returns {Object} Payload decodificado del token.
 */
const verifyToken = (token) => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET no está definido en las variables de entorno.');
  }

  return jwt.verify(token, JWT_SECRET);
};

module.exports = {
  generateToken,
  verifyToken
};
