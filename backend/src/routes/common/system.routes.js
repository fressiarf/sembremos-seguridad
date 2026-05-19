const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/common/UserController');
const DashboardController = require('../../controllers/common/DashboardController');
const AuthController = require('../../controllers/common/AuthController');
const syncController = require('../../controllers/common/SyncController');
const authMiddleware = require('../../common/middlewares/authMiddleware');
const { authorizeRoles, ROLES } = require('../../common/middlewares/roleMiddleware');

// Lista de todos los roles para dashboards
const todosLosRoles = [ROLES.ADMIN_MSP, ROLES.OFICIAL_MSP, ROLES.ADMIN_MUNI, ROLES.GESTOR_MUNI];

// Rutas de Usuario (Protegidas) → Solo el Administrador Global del MSP gestiona usuarios
router.get('/usuarios', authMiddleware, authorizeRoles([ROLES.ADMIN_MSP]), UserController.getAllUsers);

// Rutas de Dashboard (Protegidas) → Accesibles para todo el personal según su rol
router.get('/dashboard/stats', authMiddleware, authorizeRoles(todosLosRoles), DashboardController.getGlobalStats);
router.get('/dashboard/tareas', authMiddleware, authorizeRoles(todosLosRoles), DashboardController.getTareas);
router.get('/dashboard/zonas', authMiddleware, authorizeRoles(todosLosRoles), DashboardController.getZonas);
router.get('/dashboard/alertas', authMiddleware, authorizeRoles(todosLosRoles), DashboardController.getAlertas);
router.get('/dashboard/notificaciones', authMiddleware, authorizeRoles(todosLosRoles), DashboardController.getNotificaciones);
router.get('/dashboard/reportes', authMiddleware, authorizeRoles(todosLosRoles), DashboardController.getReportes);
router.get('/dashboard/comentarios', authMiddleware, authorizeRoles(todosLosRoles), DashboardController.getComentarios);
router.get('/dashboard/presupuesto', authMiddleware, authorizeRoles(todosLosRoles), DashboardController.getPresupuesto);
router.get('/dashboard/full', authMiddleware, authorizeRoles(todosLosRoles), DashboardController.getFullData);

// Rutas de Autenticación Oficiales (Públicas - El login y registro deben ser accesibles)
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/logout', AuthController.logout);

// Rutas de prueba para AuthHelper (Restringidas a ADMIN_MSP para mayor seguridad)
router.post('/auth/test-hash', authMiddleware, authorizeRoles([ROLES.ADMIN_MSP]), AuthController.testHash);
router.post('/auth/test-compare', authMiddleware, authorizeRoles([ROLES.ADMIN_MSP]), AuthController.testCompare);

// Rutas de Sincronización MSP ↔ MUNI (Solo ADMIN_MSP)
router.post('/sync/lineas', authMiddleware, authorizeRoles([ROLES.ADMIN_MSP]), syncController.syncLineas);
router.post('/sync/instituciones', authMiddleware, authorizeRoles([ROLES.ADMIN_MSP]), syncController.syncInstituciones);
router.post('/sync/kpis', authMiddleware, authorizeRoles([ROLES.ADMIN_MSP]), syncController.syncKpis);
router.post('/sync/all', authMiddleware, authorizeRoles([ROLES.ADMIN_MSP]), syncController.syncAll);
router.post('/sync/lineas/create', authMiddleware, authorizeRoles([ROLES.ADMIN_MSP]), syncController.createLinea);

module.exports = router;
