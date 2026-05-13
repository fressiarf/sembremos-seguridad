const express = require('express');
const router = express.Router();
const incidenteController = require('../../controllers/msp/incidenteController');

router.get('/', incidenteController.getIncidentes);
router.post('/', incidenteController.reportarIncidente);
router.get('/zonas', incidenteController.getZonasRiesgo);

module.exports = router;
