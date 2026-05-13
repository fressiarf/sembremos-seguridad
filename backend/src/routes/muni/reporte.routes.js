const express = require('express');
const router = express.Router();
const reporteController = require('../../controllers/muni/reporteController');

router.get('/', reporteController.getInformes);
router.post('/generar', reporteController.generarInforme);
router.post('/evidencia', reporteController.subirEvidencia);

module.exports = router;
