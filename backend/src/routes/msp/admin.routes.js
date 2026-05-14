const express = require('express');
const router = express.Router();
const SyncController = require('../../controllers/common/SyncController');
const authMiddleware = require('../../common/middlewares/authMiddleware');
const { authorizeRoles, ROLES } = require('../../common/middlewares/roleMiddleware');

// Operaciones de administración global → Solo ADMIN_MSP
router.post('/sync', authMiddleware, authorizeRoles([ROLES.ADMIN_MSP]), SyncController.triggerSync);
router.post('/lineas', authMiddleware, authorizeRoles([ROLES.ADMIN_MSP]), SyncController.createLinea);

module.exports = router;
