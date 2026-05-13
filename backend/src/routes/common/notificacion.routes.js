const express = require('express');
const router = express.Router();
const notificacionController = require('../../controllers/common/notificacionController');

router.get('/', notificacionController.getMisNotificaciones);
router.patch('/:id/leida', notificacionController.marcarLeida);

module.exports = router;
