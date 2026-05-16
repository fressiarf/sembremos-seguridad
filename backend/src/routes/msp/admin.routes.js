const express = require('express');
const router = express.Router();
const syncController = require('../../controllers/common/syncController');
const authMiddleware = require('../../common/middlewares/authMiddleware');
const { authorizeRoles, ROLES } = require('../../common/middlewares/roleMiddleware');

// Operaciones de administración global → Solo ADMIN_MSP
// Ruta legacy: mantiene compatibilidad con el frontend que llama a POST /api/v1/msp/admin/sync
router.post('/sync', authMiddleware, authorizeRoles([ROLES.ADMIN_MSP]), syncController.syncAll);
router.post('/lineas', authMiddleware, authorizeRoles([ROLES.ADMIN_MSP]), syncController.createLinea);
router.put('/lineas/:id', authMiddleware, authorizeRoles([ROLES.ADMIN_MSP]), syncController.updateLinea);
router.delete('/lineas/:id', authMiddleware, authorizeRoles([ROLES.ADMIN_MSP]), syncController.deleteLinea);

module.exports = router;
