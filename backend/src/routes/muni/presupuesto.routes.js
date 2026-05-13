const express = require('express');
const router = express.Router();
const presupuestoController = require('../../controllers/muni/presupuestoController');

router.get('/', presupuestoController.getPresupuestos);
router.post('/', presupuestoController.addGasto);

module.exports = router;
