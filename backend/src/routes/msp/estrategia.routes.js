const express = require('express');
const router = express.Router();
const estrategiaController = require('../../controllers/msp/estrategiaController');
const authMiddleware = require('../../common/middlewares/authMiddleware');
const { authorizeRoles, ROLES } = require('../../common/middlewares/roleMiddleware');

// Consulta de líneas estratégicas → Todo el personal MSP puede ver
router.get('/lineas', authMiddleware, authorizeRoles([ROLES.ADMIN_MSP, ROLES.OFICIAL_MSP]), estrategiaController.getLineasAccion);

// Creación de líneas y actualización de KPIs → Solo ADMIN_MSP puede modificar la estrategia nacional
router.post('/lineas', authMiddleware, authorizeRoles([ROLES.ADMIN_MSP]), estrategiaController.createLineaAccion);
router.patch('/kpi/:id', authMiddleware, authorizeRoles([ROLES.ADMIN_MSP]), estrategiaController.updateKpiProgreso);

module.exports = router;
