const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/common/UserController');
const DashboardController = require('../../controllers/common/DashboardController');

// Rutas de Usuario
router.get('/usuarios', UserController.getAllUsers);

// Rutas de Dashboard
router.get('/dashboard/stats', DashboardController.getGlobalStats);
router.get('/dashboard/tareas', DashboardController.getTareas);
router.get('/dashboard/zonas', DashboardController.getZonas);
router.get('/dashboard/alertas', DashboardController.getAlertas);
router.get('/dashboard/notificaciones', DashboardController.getNotificaciones);
router.get('/dashboard/reportes', DashboardController.getReportes);
router.get('/dashboard/comentarios', DashboardController.getComentarios);
router.get('/dashboard/presupuesto', DashboardController.getPresupuesto);
router.get('/dashboard/full', DashboardController.getFullData);

module.exports = router;
