const express = require('express');
const router = express.Router();
const recordatorioController = require('../../controllers/muni/recordatorioController');
const authMiddleware = require('../../common/middlewares/authMiddleware');

// Todas las rutas requieren sesión
router.use(authMiddleware);

router.get('/recordatorios/proximos', recordatorioController.proximos);
router.get('/usuarios/me/preferencias', recordatorioController.obtenerPreferencias);
router.patch('/usuarios/me/preferencias', recordatorioController.actualizarPreferencias);

module.exports = router;
