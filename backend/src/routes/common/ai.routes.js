const express = require('express');
const router = express.Router();
const aiController = require('../../controllers/common/aiController');

router.post('/analizar-reporte', aiController.analizarReporte);
router.post('/analizar-incidente', aiController.analizarIncidente);

module.exports = router;
