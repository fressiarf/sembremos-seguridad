const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware
app.use(cors({ 
  origin: ['http://localhost:5173', 'http://localhost:5174'], 
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Archivos estáticos (para evidencias)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

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
const recordatorioRoutes = require('./routes/muni/recordatorio.routes');

// Rutas COMUNES
const systemRoutes = require('./routes/common/system.routes');
const notificacionRoutes = require('./routes/common/notificacion.routes');
const aiRoutes = require('./routes/common/ai.routes');
const authRoutes = require('./routes/common/auth.routes');

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
app.use('/api/v1/muni', recordatorioRoutes);

app.use('/api/v1/system', systemRoutes);
app.use('/api/v1/system/notificaciones', notificacionRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/ai', aiRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a la API del sistema Sembremos Seguridad.' });
});

// Rutas Legacy (Compatibilidad con json-server para el frontend existente)
// Se colocan al final como catch-all para evitar colisiones con rutas oficiales o healthchecks
const legacyRoutes = require('./routes/legacy/jsonProxy.routes');
app.use('/', legacyRoutes);

// Manejo de errores centralizado
const errorHandler = require('./middlewares/errors/errorHandler');
app.use(errorHandler);

module.exports = app;
