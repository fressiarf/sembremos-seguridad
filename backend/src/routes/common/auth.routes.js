const express = require('express');
const router = express.Router();
const AuthController = require('../../controllers/common/AuthController');
const authMiddleware = require('../../common/middlewares/authMiddleware');

/**
 * Rutas de Autenticación de Usuario
 * Prefijo: /api/auth
 */

// Endpoint para validar la identidad actual (Persistencia de sesión)
router.get('/me', authMiddleware, AuthController.getCurrentUser);

// Login, Register y Logout también podrían estar aquí, 
// pero se mantienen en system.routes por el momento para compatibilidad.

module.exports = router;
