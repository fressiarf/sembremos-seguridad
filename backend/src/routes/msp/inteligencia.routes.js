const express = require('express');
const router = express.Router();
const inteligenciaController = require('../../controllers/msp/inteligenciaController');
const authMiddleware = require('../../common/middlewares/authMiddleware');
const { authorizeRoles, ROLES } = require('../../common/middlewares/roleMiddleware');

// RECURSO CLASIFICADO: Solo personal del MSP puede acceder a inteligencia táctica
router.get('/', authMiddleware, authorizeRoles([ROLES.ADMIN_MSP, ROLES.OFICIAL_MSP]), inteligenciaController.getInformesIntel);
router.post('/', authMiddleware, authorizeRoles([ROLES.ADMIN_MSP, ROLES.OFICIAL_MSP]), inteligenciaController.registrarHallazgo);

module.exports = router;
