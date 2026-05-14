const express = require('express');
const router = express.Router();
const presupuestoController = require('../../controllers/muni/presupuestoController');
const authMiddleware = require('../../common/middlewares/authMiddleware');
const { authorizeRoles, ROLES } = require('../../common/middlewares/roleMiddleware');

// Consulta de presupuesto → Todo el personal municipal puede ver
router.get('/', authMiddleware, authorizeRoles([ROLES.ADMIN_MUNI, ROLES.GESTOR_MUNI]), presupuestoController.getPresupuestos);

// Registro de gasto → Solo el administrador municipal autoriza erogaciones
router.post('/', authMiddleware, authorizeRoles([ROLES.ADMIN_MUNI]), presupuestoController.addGasto);

module.exports = router;
