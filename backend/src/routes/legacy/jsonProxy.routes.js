/**
 * Rutas Legacy (Puente json-server → Sequelize)
 * 
 * Este módulo sirve los mismos endpoints que json-server usaba,
 * pero ahora conectados a las bases de datos reales (MSP y MUNI)
 * a través de los modelos Sequelize.
 * 
 * El frontend no necesita cambiar ninguna URL.
 * 
 * Colecciones migradas:
 *   /usuarios          → UsuarioFP + UsuarioLocal
 *   /lineasAccion      → LineaAccion + AccionEstrategica + KpiNacional
 *   /tareas            → ActividadLocal
 *   /zonas             → ZonaRiesgo
 *   /alertas           → AlertaCumplimiento
 *   /reportes          → ReporteEvidencia
 *   /eventos           → EventoCalendario
 *   /comentariosSoporte → SoporteTicket
 *   /notificaciones    → (placeholder hasta crear modelo)
 *   /presupuestoAsignado → PresupuestoDetalle (suma)
 */
const express = require('express');
const router = express.Router();
const authMiddleware = require('../../common/middlewares/authMiddleware');

// Aplicar autenticación por cookie JWT a TODAS las rutas del proxy
router.use(authMiddleware);

// ═══════════════════════════════════════════════════════
//  USUARIOS — Fusión MSP + MUNI
// ═══════════════════════════════════════════════════════

router.get('/usuarios', async (req, res) => {
  try {
    const UsuarioLocal = require('../../models/muni/UsuarioLocal');
    const UsuarioFP = require('../../models/msp/UsuarioFP');

    const [muniUsers, mspUsers] = await Promise.all([
      UsuarioLocal.findAll(),
      UsuarioFP.findAll()
    ]);

    const formatted = [
      ...muniUsers.map(u => ({
        id: u.id,
        usuario: u.email,
        nombre: u.nombre,
        rol: 'municipalidad',
        institucion: 'Municipalidad',
        tipo: 'MUNI'
      })),
      ...mspUsers.map(u => ({
        id: u.id,
        usuario: u.email,
        nombre: u.nombre,
        rol: 'admin',
        institucion: 'Ministerio de Seguridad Pública',
        tipo: 'MSP'
      }))
    ];

    return res.json(formatted);
  } catch (error) {
    console.error('[LEGACY] Error en /usuarios:', error.message);
    return res.json([]);
  }
});

// ═══════════════════════════════════════════════════════
//  LÍNEAS DE ACCIÓN — MSP
// ═══════════════════════════════════════════════════════

router.get('/lineasAccion', async (req, res) => {
  try {
    const LineaAccion = require('../../models/msp/LineaAccion');
    const lineas = await LineaAccion.findAll({
      order: [['created_at', 'DESC']]
    });
    return res.json(lineas);
  } catch (error) {
    console.error('[LEGACY] Error en /lineasAccion:', error.message);
    return res.json([]);
  }
});

router.post('/lineasAccion', async (req, res) => {
  try {
    const LineaAccion = require('../../models/msp/LineaAccion');
    const nueva = await LineaAccion.create(req.body);
    return res.status(201).json(nueva);
  } catch (error) {
    console.error('[LEGACY] Error POST /lineasAccion:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════
//  TAREAS (AccionEstrategica) — MSP
// ═══════════════════════════════════════════════════════

router.get('/tareas', async (req, res) => {
  try {
    const AccionEstrategica = require('../../models/msp/AccionEstrategica');
    const KpiNacional = require('../../models/msp/KpiNacional');
    
    const acciones = await AccionEstrategica.findAll({
      include: [{ model: KpiNacional, as: 'kpis' }],
      order: [['created_at', 'DESC']]
    });

    // Transformamos al formato que el frontend espera
    const tareas = acciones.map(a => ({
      id: a.id,
      lineaAccionId: a.linea_id,
      titulo: a.nombre,
      descripcion: a.objetivo_especifico,
      completada: false,
      estado: 'Sin Actividades',
      ...a.dataValues
    }));

    return res.json(tareas);
  } catch (error) {
    console.error('[LEGACY] Error en /tareas:', error.message);
    return res.json([]);
  }
});

router.get('/tareas/:id', async (req, res) => {
  try {
    const AccionEstrategica = require('../../models/msp/AccionEstrategica');
    const tarea = await AccionEstrategica.findByPk(req.params.id);
    if (!tarea) return res.status(404).json({ error: 'Tarea no encontrada' });
    return res.json(tarea);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/tareas', async (req, res) => {
  try {
    const AccionEstrategica = require('../../models/msp/AccionEstrategica');
    const nueva = await AccionEstrategica.create({
      linea_id: req.body.lineaAccionId || req.body.linea_id,
      nombre: req.body.titulo || req.body.nombre,
      objetivo_especifico: req.body.descripcion || req.body.objetivo_especifico || ''
    });
    return res.status(201).json(nueva);
  } catch (error) {
    console.error('[LEGACY] Error POST /tareas:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

router.patch('/tareas/:id', async (req, res) => {
  try {
    const AccionEstrategica = require('../../models/msp/AccionEstrategica');
    const tarea = await AccionEstrategica.findByPk(req.params.id);
    if (!tarea) return res.status(404).json({ error: 'Tarea no encontrada' });
    await tarea.update(req.body);
    return res.json(tarea);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════
//  ZONAS — MSP (ZonaRiesgo)
// ═══════════════════════════════════════════════════════

router.get('/zonas', async (req, res) => {
  try {
    const ZonaRiesgo = require('../../models/msp/ZonaRiesgo');
    const zonas = await ZonaRiesgo.findAll();
    return res.json(zonas);
  } catch (error) {
    console.error('[LEGACY] Error en /zonas:', error.message);
    return res.json([]);
  }
});

// ═══════════════════════════════════════════════════════
//  ALERTAS — MSP (AlertaCumplimiento)
// ═══════════════════════════════════════════════════════

router.get('/alertas', async (req, res) => {
  try {
    const AlertaCumplimiento = require('../../models/msp/AlertaCumplimiento');
    const alertas = await AlertaCumplimiento.findAll({
      order: [['created_at', 'DESC']]
    });

    // Transformar al formato que espera el frontend
    const formatted = alertas.map(a => ({
      id: a.id,
      descripcion: a.mensaje,
      tipo: a.resuelta ? 'resuelta' : 'pendiente',
      ...a.dataValues
    }));

    return res.json(formatted);
  } catch (error) {
    console.error('[LEGACY] Error en /alertas:', error.message);
    return res.json([]);
  }
});

// ═══════════════════════════════════════════════════════
//  REPORTES — MUNI (ReporteEvidencia)
// ═══════════════════════════════════════════════════════

router.get('/reportes', async (req, res) => {
  try {
    const ReporteEvidencia = require('../../models/muni/ReporteEvidencia');
    const reportes = await ReporteEvidencia.findAll({
      order: [['created_at', 'DESC']]
    });

    // Aplicar filtros por query string (compatible con json-server)
    let result = reportes.map(r => r.dataValues);
    const queryKeys = Object.keys(req.query).filter(k => !k.startsWith('_'));
    for (const key of queryKeys) {
      result = result.filter(item => String(item[key]) === String(req.query[key]));
    }

    return res.json(result);
  } catch (error) {
    console.error('[LEGACY] Error en /reportes:', error.message);
    return res.json([]);
  }
});

router.get('/reportes/:id', async (req, res) => {
  try {
    const ReporteEvidencia = require('../../models/muni/ReporteEvidencia');
    const reporte = await ReporteEvidencia.findByPk(req.params.id);
    if (!reporte) return res.status(404).json({ error: 'Reporte no encontrado' });
    return res.json(reporte);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/reportes', async (req, res) => {
  try {
    const ReporteEvidencia = require('../../models/muni/ReporteEvidencia');
    const nuevo = await ReporteEvidencia.create(req.body);
    return res.status(201).json(nuevo);
  } catch (error) {
    console.error('[LEGACY] Error POST /reportes:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

router.patch('/reportes/:id', async (req, res) => {
  try {
    const ReporteEvidencia = require('../../models/muni/ReporteEvidencia');
    const reporte = await ReporteEvidencia.findByPk(req.params.id);
    if (!reporte) return res.status(404).json({ error: 'Reporte no encontrado' });
    await reporte.update(req.body);
    return res.json(reporte);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════
//  EVENTOS — MUNI (EventoCalendario)
// ═══════════════════════════════════════════════════════

router.get('/eventos', async (req, res) => {
  try {
    const EventoCalendario = require('../../models/muni/EventoCalendario');
    const eventos = await EventoCalendario.findAll({
      order: [['fecha_inicio', 'ASC']]
    });
    return res.json(eventos);
  } catch (error) {
    console.error('[LEGACY] Error en /eventos:', error.message);
    return res.json([]);
  }
});

router.post('/eventos', async (req, res) => {
  try {
    const EventoCalendario = require('../../models/muni/EventoCalendario');
    const nuevo = await EventoCalendario.create(req.body);
    return res.status(201).json(nuevo);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/eventos/:id', async (req, res) => {
  try {
    const EventoCalendario = require('../../models/muni/EventoCalendario');
    const evento = await EventoCalendario.findByPk(req.params.id);
    if (!evento) return res.status(404).json({ error: 'Evento no encontrado' });
    await evento.destroy();
    return res.json({});
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════
//  COMENTARIOS SOPORTE — MUNI (SoporteTicket)
// ═══════════════════════════════════════════════════════

router.get('/comentariosSoporte', async (req, res) => {
  try {
    const SoporteTicket = require('../../models/muni/SoporteTicket');
    const tickets = await SoporteTicket.findAll({
      order: [['created_at', 'DESC']]
    });

    // Transformar al formato que espera el frontend
    const formatted = tickets.map(t => ({
      id: t.id,
      asunto: t.asunto,
      mensaje: t.mensaje,
      fecha: t.created_at,
      estado: 'pendiente',
      ...t.dataValues
    }));

    return res.json(formatted);
  } catch (error) {
    console.error('[LEGACY] Error en /comentariosSoporte:', error.message);
    return res.json([]);
  }
});

router.post('/comentariosSoporte', async (req, res) => {
  try {
    const SoporteTicket = require('../../models/muni/SoporteTicket');
    const nuevo = await SoporteTicket.create(req.body);
    return res.status(201).json(nuevo);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.patch('/comentariosSoporte/:id', async (req, res) => {
  try {
    const SoporteTicket = require('../../models/muni/SoporteTicket');
    const ticket = await SoporteTicket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Ticket no encontrado' });
    await ticket.update(req.body);
    return res.json(ticket);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/comentariosSoporte/:id', async (req, res) => {
  try {
    const SoporteTicket = require('../../models/muni/SoporteTicket');
    const ticket = await SoporteTicket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Ticket no encontrado' });
    await ticket.destroy();
    return res.json({});
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════
//  NOTIFICACIONES — Placeholder (sin modelo dedicado aún)
// ═══════════════════════════════════════════════════════

router.get('/notificaciones', async (req, res) => {
  try {
    const NotificacionFP = require('../../models/msp/NotificacionFP');
    const NotificacionLocal = require('../../models/muni/NotificacionLocal');

    const [fpNotifs, localNotifs] = await Promise.all([
      NotificacionFP.findAll({ order: [['created_at', 'DESC']], limit: 50 }),
      NotificacionLocal.findAll({ order: [['created_at', 'DESC']], limit: 50 })
    ]);

    const formatted = [
      ...fpNotifs.map(n => ({ ...n.dataValues, origen: 'MSP' })),
      ...localNotifs.map(n => ({ ...n.dataValues, origen: 'MUNI' }))
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return res.json(formatted);
  } catch (error) {
    console.error('[LEGACY] Error en /notificaciones:', error.message);
    return res.json([]);
  }
});

// ═══════════════════════════════════════════════════════
//  PRESUPUESTO ASIGNADO — MUNI (PresupuestoDetalle suma)
// ═══════════════════════════════════════════════════════

router.get('/presupuestoAsignado', async (req, res) => {
  try {
    const PresupuestoDetalle = require('../../models/muni/PresupuestoDetalle');
    const { fn, col } = require('sequelize');
    
    const result = await PresupuestoDetalle.findOne({
      attributes: [[fn('COALESCE', fn('SUM', col('monto_ejecutado')), 0), 'total']]
    });

    return res.json(result ? Number(result.dataValues.total) : 0);
  } catch (error) {
    console.error('[LEGACY] Error en /presupuestoAsignado:', error.message);
    return res.json(0);
  }
});

// ═══════════════════════════════════════════════════════
//  DISTRIBUCIÓN POLICIAL — MSP
// ═══════════════════════════════════════════════════════

router.get('/distribucionPolicial', async (req, res) => {
  try {
    const DistribucionPolicial = require('../../models/msp/DistribucionPolicial');
    const distribuciones = await DistribucionPolicial.findAll();
    return res.json(distribuciones);
  } catch (error) {
    console.error('[LEGACY] Error en /distribucionPolicial:', error.message);
    return res.json([]);
  }
});

module.exports = router;
