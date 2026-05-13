const express = require('express');
const router = express.Router();
const SyncController = require('../controllers/SyncController');

// Ruta para disparar la sincronización manualmente
// POST /api/admin/sync
router.post('/sync', SyncController.triggerSync);
router.post('/lineas', SyncController.createLinea);

module.exports = router;
