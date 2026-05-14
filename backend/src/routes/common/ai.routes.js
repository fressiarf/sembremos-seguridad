const express = require('express');
const router = express.Router();
const aiController = require('../../controllers/common/aiController');
const authMiddleware = require('../../common/middlewares/authMiddleware');
const { authorizeRoles, ROLES } = require('../../common/middlewares/roleMiddleware');

// Análisis de reportes de evidencia → Personal municipal
router.post('/analizar-reporte',
  authMiddleware,
  authorizeRoles([ROLES.ADMIN_MUNI, ROLES.GESTOR_MUNI]),
  aiController.analizarReporte
);

// Análisis de incidentes delictivos → Solo personal del MSP
router.post('/analizar-incidente',
  authMiddleware,
  authorizeRoles([ROLES.ADMIN_MSP, ROLES.OFICIAL_MSP]),
  aiController.analizarIncidente
);

module.exports = router;
