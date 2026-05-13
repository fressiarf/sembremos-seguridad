const express = require('express');
const router = express.Router();
const reporteController = require('../../controllers/muni/reporteController');
const upload = require('../../middlewares/storage/upload');

router.get('/', reporteController.getInformes);
router.post('/generar', reporteController.generarInforme);
router.post('/evidencia', upload.single('archivo'), reporteController.subirEvidencia);

module.exports = router;
