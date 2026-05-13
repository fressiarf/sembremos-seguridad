const express = require('express');
const cors = require('cors');

const app = express();

// Rutas MSP
const adminRoutes = require('./routes/msp/admin.routes');
const territorioRoutes = require('./routes/msp/territorio.routes');
const institucionRoutes = require('./routes/msp/institucion.routes');
const estrategiaRoutes = require('./routes/msp/estrategia.routes');
const incidenteRoutes = require('./routes/msp/incidente.routes');
const inteligenciaRoutes = require('./routes/msp/inteligencia.routes');

// Rutas MUNI
const configLocalRoutes = require('./routes/muni/configLocal.routes');
const actividadRoutes = require('./routes/muni/actividad.routes');
const reporteRoutes = require('./routes/muni/reporte.routes');
const presupuestoRoutes = require('./routes/muni/presupuesto.routes');

// Rutas COMUNES
const systemRoutes = require('./routes/common/system.routes');
const notificacionRoutes = require('./routes/common/notificacion.routes');

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoints v1
app.use('/api/v1/msp/territorio', territorioRoutes);
app.use('/api/v1/msp/instituciones', institucionRoutes);
app.use('/api/v1/msp/estrategia', estrategiaRoutes);
app.use('/api/v1/msp/incidentes', incidenteRoutes);
app.use('/api/v1/msp/inteligencia', inteligenciaRoutes);
app.use('/api/v1/msp/admin', adminRoutes);

app.use('/api/v1/muni/config', configLocalRoutes);
app.use('/api/v1/muni/actividades', actividadRoutes);
app.use('/api/v1/muni/reportes', reporteRoutes);
app.use('/api/v1/muni/presupuesto', presupuestoRoutes);

app.use('/api/v1/system', systemRoutes);
app.use('/api/v1/system/notificaciones', notificacionRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a la API del sistema.' });
});

module.exports = app;
