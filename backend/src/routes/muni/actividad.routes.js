const express = require('express');
const router = express.Router();
const actividadController = require('../../controllers/muni/actividadController');
const authMiddleware = require('../../common/middlewares/authMiddleware');
const { authorizeRoles, ROLES } = require('../../common/middlewares/roleMiddleware');

// Gestión de actividades → Personal municipal
router.get('/', authMiddleware, authorizeRoles([ROLES.ADMIN_MUNI, ROLES.GESTOR_MUNI]), actividadController.getActividades);
router.post('/', authMiddleware, authorizeRoles([ROLES.ADMIN_MUNI, ROLES.GESTOR_MUNI]), actividadController.createActividad);

// Registro de hitos → Operativo para personal municipal
router.post('/hitos', authMiddleware, authorizeRoles([ROLES.ADMIN_MUNI, ROLES.GESTOR_MUNI]), actividadController.addHito);

module.exports = router;
