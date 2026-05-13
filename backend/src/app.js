const express = require('express');
const cors = require('cors');

const app = express();

const adminRoutes = require('./routes/adminRoutes');
const UserController = require('./controllers/UserController');
const DashboardController = require('./controllers/DashboardController');

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/admin', adminRoutes);
app.get('/usuarios', UserController.getAllUsers);

// Rutas para el Dashboard Nacional (MSP)
app.get('/lineasAccion', DashboardController.getGlobalStats);
app.get('/tareas', DashboardController.getTareas);
app.get('/zonas', DashboardController.getZonas);
app.get('/alertas', DashboardController.getAlertas);
app.get('/notificaciones', DashboardController.getNotificaciones);
app.get('/reportes', DashboardController.getReportes);
app.get('/comentariosSoporte', DashboardController.getComentarios);
app.get('/presupuestoAsignado', DashboardController.getPresupuesto);
app.get('/full-dashboard-data', DashboardController.getFullData);

app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a la API del sistema.' });
});

module.exports = app;
