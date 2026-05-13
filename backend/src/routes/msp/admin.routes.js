const express = require('express');
const router = express.Router();
const SyncController = require('../../controllers/common/SyncController');

router.post('/sync', SyncController.triggerSync);
router.post('/lineas', SyncController.createLinea);

module.exports = router;
