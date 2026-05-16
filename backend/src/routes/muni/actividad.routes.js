const express = require('express');
const router = express.Router();
const actividadController = require('../../controllers/muni/actividadController');
const authMiddleware = require('../../common/middlewares/authMiddleware');
const { authorizeRoles, ROLES } = require('../../common/middlewares/roleMiddleware');

// Gestión de actividades → Personal municipal y SuperAdmin
const ALLOWED_ROLES = [ROLES.SUPER_ADMIN, ROLES.ADMIN_MUNI, ROLES.GESTOR_MUNI];

router.get('/', authMiddleware, authorizeRoles(ALLOWED_ROLES), actividadController.getActividades);
router.post('/', authMiddleware, authorizeRoles(ALLOWED_ROLES), actividadController.createActividad);
router.put('/:id', authMiddleware, authorizeRoles(ALLOWED_ROLES), actividadController.updateActividad);
router.delete('/:id', authMiddleware, authorizeRoles(ALLOWED_ROLES), actividadController.deleteActividad);

// Registro de hitos
router.post('/hitos', authMiddleware, authorizeRoles(ALLOWED_ROLES), actividadController.addHito);

module.exports = router;
