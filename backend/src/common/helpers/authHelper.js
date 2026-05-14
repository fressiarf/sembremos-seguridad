const bcrypt = require('bcryptjs');

/**
 * Genera un hash seguro para una contraseña en texto plano.
 * @param {string} password - La contraseña proporcionada por el usuario.
 * @returns {Promise<string>} - El hash generado.
 */
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Compara una contraseña en texto plano con un hash almacenado.
 * @param {string} password - La contraseña ingresada en el login.
 * @param {string} hashedPassword - El hash recuperado de la base de datos.
 * @returns {Promise<boolean>} - True si coinciden, false en caso contrario.
 */
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword
};
