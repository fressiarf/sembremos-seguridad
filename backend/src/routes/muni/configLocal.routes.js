const express = require('express');
const router = express.Router();
const configLocalController = require('../../controllers/muni/configLocalController');
const authMiddleware = require('../../common/middlewares/authMiddleware');
const { authorizeRoles, ROLES } = require('../../common/middlewares/roleMiddleware');

// Configuración y consulta de base local → Solo Administrador Municipal
router.get('/instituciones', authMiddleware, authorizeRoles([ROLES.ADMIN_MUNI]), configLocalController.getInstitucionesLocales);
router.get('/roles', authMiddleware, authorizeRoles([ROLES.ADMIN_MUNI]), configLocalController.getRolesLocales);

module.exports = router;
