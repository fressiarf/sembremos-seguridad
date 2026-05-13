const express = require('express');
const router = express.Router();
const institucionController = require('../../controllers/msp/institucionController');

router.get('/', institucionController.getInstitucionesMaestras);
router.post('/', institucionController.createInstitucionMaestra);
router.get('/tipos', institucionController.getTiposInstitucion);

module.exports = router;
