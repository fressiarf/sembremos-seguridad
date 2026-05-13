const express = require('express');
const router = express.Router();
const actividadController = require('../../controllers/muni/actividadController');

router.get('/', actividadController.getActividades);
router.post('/', actividadController.createActividad);
router.post('/hitos', actividadController.addHito);

module.exports = router;
