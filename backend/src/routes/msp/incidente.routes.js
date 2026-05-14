const express = require('express');
const router = express.Router();
const incidenteController = require('../../controllers/msp/incidenteController');
const authMiddleware = require('../../common/middlewares/authMiddleware');
const { authorizeRoles, ROLES } = require('../../common/middlewares/roleMiddleware');

// Datos de incidentes y zonas de riesgo → Personal operativo del MSP
router.get('/', authMiddleware, authorizeRoles([ROLES.ADMIN_MSP, ROLES.OFICIAL_MSP]), incidenteController.getIncidentes);
router.post('/', authMiddleware, authorizeRoles([ROLES.ADMIN_MSP, ROLES.OFICIAL_MSP]), incidenteController.reportarIncidente);
router.get('/zonas', authMiddleware, authorizeRoles([ROLES.ADMIN_MSP, ROLES.OFICIAL_MSP]), incidenteController.getZonasRiesgo);

module.exports = router;
