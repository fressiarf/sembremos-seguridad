const { check, validationResult } = require('express-validator');

/**
 * Middleware para capturar y retornar errores de validación
 */
const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Error de validación en los datos de entrada',
      errors: errors.array()
    });
  }
  next();
};

/**
 * Validaciones para el registro de usuarios
 */
const validateRegister = [
  check('nombre')
    .exists().withMessage('El nombre es obligatorio')
    .notEmpty().withMessage('El nombre no puede estar vacío')
    .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
  
  check('apellido')
    .exists().withMessage('El apellido es obligatorio')
    .notEmpty().withMessage('El apellido no puede estar vacío'),

  check('email')
    .exists().withMessage('El email es obligatorio')
    .isEmail().withMessage('Debe proporcionar un formato de email válido'),

  check('password')
    .exists().withMessage('La contraseña es obligatoria')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
  
  check('cedula')
    .exists().withMessage('La cédula es obligatoria')
    .matches(/^[1-9][0-9]{8}$/).withMessage('La cédula debe tener un formato válido de 9 dígitos'),

  (req, res, next) => {
    validateResult(req, res, next);
  }
];

/**
 * Validaciones para el inicio de sesión
 */
const validateLogin = [
  check('email')
    .exists().withMessage('El email es obligatorio')
    .isEmail().withMessage('Debe proporcionar un formato de email válido'),
  
  check('password')
    .exists().withMessage('La contraseña es obligatoria'),

  (req, res, next) => {
    validateResult(req, res, next);
  }
];

module.exports = {
  validateRegister,
  validateLogin
};
