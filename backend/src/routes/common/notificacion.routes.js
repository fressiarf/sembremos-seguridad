const express = require('express');
const router = express.Router();
const notificacionController = require('../../controllers/common/notificacionController');
const authMiddleware = require('../../common/middlewares/authMiddleware');
const { authorizeRoles, ROLES } = require('../../common/middlewares/roleMiddleware');

// Todos los roles autenticados pueden gestionar sus propias notificaciones
const todosLosRoles = [ROLES.ADMIN_MSP, ROLES.OFICIAL_MSP, ROLES.ADMIN_MUNI, ROLES.GESTOR_MUNI];

router.get('/', authMiddleware, authorizeRoles(todosLosRoles), notificacionController.getMisNotificaciones);
router.patch('/:id/leida', authMiddleware, authorizeRoles(todosLosRoles), notificacionController.marcarLeida);

module.exports = router;
