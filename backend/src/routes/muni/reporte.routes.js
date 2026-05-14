const express = require('express');
const router = express.Router();
const reporteController = require('../../controllers/muni/reporteController');
const upload = require('../../middlewares/storage/upload');
const authMiddleware = require('../../common/middlewares/authMiddleware');
const { authorizeRoles, ROLES } = require('../../common/middlewares/roleMiddleware');

// Consulta de informes → Todo el personal municipal puede ver el historial
router.get('/', authMiddleware, authorizeRoles([ROLES.ADMIN_MUNI, ROLES.GESTOR_MUNI]), reporteController.getInformes);

// Generación de informe oficial → Solo el administrador municipal puede generar informes formales
router.post('/generar', authMiddleware, authorizeRoles([ROLES.ADMIN_MUNI]), reporteController.generarInforme);

// Carga de evidencia fotográfica → El gestor de campo puede subir evidencia
router.post('/evidencia', authMiddleware, authorizeRoles([ROLES.ADMIN_MUNI, ROLES.GESTOR_MUNI]), upload.single('archivo'), reporteController.subirEvidencia);

module.exports = router;
