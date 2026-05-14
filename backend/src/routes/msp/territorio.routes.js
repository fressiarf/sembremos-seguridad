const express = require('express');
const router = express.Router();
const territorioController = require('../../controllers/msp/territorioController');
const authMiddleware = require('../../common/middlewares/authMiddleware');
const { authorizeRoles, ROLES } = require('../../common/middlewares/roleMiddleware');

// Datos geográficos de territorio → Personal operativo del MSP
router.get('/provincias', authMiddleware, authorizeRoles([ROLES.ADMIN_MSP, ROLES.OFICIAL_MSP]), territorioController.getProvincias);
router.get('/cantones/:provinciaId', authMiddleware, authorizeRoles([ROLES.ADMIN_MSP, ROLES.OFICIAL_MSP]), territorioController.getCantonesByProvincia);
router.get('/distritos/:cantonId', authMiddleware, authorizeRoles([ROLES.ADMIN_MSP, ROLES.OFICIAL_MSP]), territorioController.getDistritosByCanton);

module.exports = router;
