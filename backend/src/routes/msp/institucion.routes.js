const express = require('express');
const router = express.Router();
const institucionController = require('../../controllers/msp/institucionController');
const authMiddleware = require('../../common/middlewares/authMiddleware');
const { authorizeRoles, ROLES } = require('../../common/middlewares/roleMiddleware');

// Consulta de instituciones y catálogos → Todo el personal MSP
router.get('/', authMiddleware, authorizeRoles([ROLES.ADMIN_MSP, ROLES.OFICIAL_MSP]), institucionController.getInstitucionesMaestras);
router.get('/tipos', authMiddleware, authorizeRoles([ROLES.ADMIN_MSP, ROLES.OFICIAL_MSP]), institucionController.getTiposInstitucion);

// Alta de nuevas instituciones → Solo el administrador MSP
router.post('/', authMiddleware, authorizeRoles([ROLES.ADMIN_MSP]), institucionController.createInstitucionMaestra);

module.exports = router;
