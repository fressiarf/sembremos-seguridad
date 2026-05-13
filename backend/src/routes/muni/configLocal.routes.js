const express = require('express');
const router = express.Router();
const configLocalController = require('../../controllers/muni/configLocalController');

router.get('/instituciones', configLocalController.getInstitucionesLocales);
router.get('/roles', configLocalController.getRolesLocales);

module.exports = router;
