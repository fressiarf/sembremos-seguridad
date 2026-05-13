const express = require('express');
const router = express.Router();
const estrategiaController = require('../../controllers/msp/estrategiaController');

router.get('/lineas', estrategiaController.getLineasAccion);
router.post('/lineas', estrategiaController.createLineaAccion);
router.patch('/kpi/:id', estrategiaController.updateKpiProgreso);

module.exports = router;
