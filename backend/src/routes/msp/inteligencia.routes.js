const express = require('express');
const router = express.Router();
const inteligenciaController = require('../../controllers/msp/inteligenciaController');

router.get('/', inteligenciaController.getInformesIntel);
router.post('/', inteligenciaController.registrarHallazgo);

module.exports = router;
