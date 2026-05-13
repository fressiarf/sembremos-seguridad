const express = require('express');
const router = express.Router();
const territorioController = require('../controllers/territorioController');

router.get('/provincias', territorioController.getProvincias);
router.get('/cantones/:provinciaId', territorioController.getCantonesByProvincia);
router.get('/distritos/:cantonId', territorioController.getDistritosByCanton);

module.exports = router;
