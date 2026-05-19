const express = require('express');
const router = express.Router();
const authMiddleware = require('../../common/middlewares/authMiddleware');
const recordatorioAdminController = require('../../controllers/admin/recordatorioAdminController');

router.use(authMiddleware);

router.get('/recordatorios', recordatorioAdminController.listar);
router.get('/recordatorios/resumen', recordatorioAdminController.resumen);

module.exports = router;
