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

// Modelos MSP
const LineaAccion = require('../../models/msp/LineaAccion');
const AccionEstrategica = require('../../models/msp/AccionEstrategica');
const KpiNacional = require('../../models/msp/KpiNacional');
const UsuarioFP = require('../../models/msp/UsuarioFP');
const ZonaRiesgo = require('../../models/msp/ZonaRiesgo');
const AlertaCumplimiento = require('../../models/msp/AlertaCumplimiento');

// Modelos MUNI
const ActividadLocal = require('../../models/muni/ActividadLocal');
const PresupuestoDetalle = require('../../models/muni/PresupuestoDetalle');
const UsuarioLocal = require('../../models/muni/UsuarioLocal');
const ReporteEvidencia = require('../../models/muni/ReporteEvidencia');
const DesgloseAsistencia = require('../../models/muni/DesgloseAsistencia');
const EventoCalendario = require('../../models/muni/EventoCalendario');
const SoporteTicket = require('../../models/muni/SoporteTicket');

const { fn, col, Op } = require('sequelize');

// Aplicar autenticación por cookie JWT a TODAS las rutas del proxy
router.use(authMiddleware);

// ═══════════════════════════════════════════════════════
//  USUARIOS — Fusión MSP + MUNI
// ═══════════════════════════════════════════════════════

router.get('/usuarios', async (req, res) => {
  try {
    const [muniUsers, mspUsers] = await Promise.all([
      UsuarioLocal.findAll(),
      UsuarioFP.findAll()
    ]);

    const formatted = [
      ...muniUsers.map(u => ({
        ...u.dataValues,
        id: `muni_${u.id}`,
        db_id: u.id,
        usuario: u.email,
        rol: u.role || 'municipalidad',
        tipo: 'MUNI',
        nivel: 'MUNI'
      })),
      ...mspUsers.map(u => ({
        ...u.dataValues,
        id: `msp_${u.id}`,
        db_id: u.id,
        usuario: u.email,
        rol: u.role || 'admin',
        tipo: 'MSP',
        nivel: 'MSP'
      }))
    ];

    return res.json(formatted);
  } catch (error) {
    console.error('[LEGACY] Error en /usuarios:', error.message);
    return res.json([]);
  }
});

// NUEVO: Soporte para eliminación de usuarios
router.delete('/usuarios/:id', async (req, res) => {
  try {
    const UsuarioLocal = require('../../models/muni/UsuarioLocal');
    const UsuarioFP = require('../../models/msp/UsuarioFP');
    const { id } = req.params;

    // Detectar de qué base de datos viene por el prefijo
    if (id.startsWith('msp_')) {
      await UsuarioFP.destroy({ where: { id: id.replace('msp_', '') } });
    } else if (id.startsWith('muni_')) {
      await UsuarioLocal.destroy({ where: { id: id.replace('muni_', '') } });
    } else {
      // Intento a ciegas si no hay prefijo (compatibilidad)
      await UsuarioFP.destroy({ where: { id } });
      await UsuarioLocal.destroy({ where: { id } });
    }

    return res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('[LEGACY] Error DELETE /usuarios:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

// NUEVO: Soporte para actualización de usuarios (Ajustado para prefijos)
router.patch('/usuarios/:id', async (req, res) => {
  try {
    const UsuarioLocal = require('../../models/muni/UsuarioLocal');
    const UsuarioFP = require('../../models/msp/UsuarioFP');
    const { id } = req.params;

    let user;
    if (id.startsWith('msp_')) {
      user = await UsuarioFP.findByPk(id.replace('msp_', ''));
    } else if (id.startsWith('muni_')) {
      user = await UsuarioLocal.findByPk(id.replace('muni_', ''));
    } else {
      user = await UsuarioFP.findByPk(id) || await UsuarioLocal.findByPk(id);
    }

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const { nombre, apellido, email, role, cedula, password, activo } = req.body;
    const updateData = {};
    if (nombre) updateData.nombre = nombre;
    if (apellido) updateData.apellido = apellido;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (cedula) updateData.cedula = cedula;
    if (activo !== undefined) updateData.activo = activo;
    if (password) {
      const bcrypt = require('bcryptjs');
      updateData.password = await bcrypt.hash(password, 10);
    }

    await user.update(updateData);
    return res.json({ message: 'Usuario actualizado correctamente' });
  } catch (error) {
    console.error('[LEGACY] Error PATCH /usuarios:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

// NUEVO: Catálogo de instituciones para el formulario de registro
router.get('/usuarios/catalogos/instituciones', async (req, res) => {
  try {
    const InstitucionMaestra = require('../../models/msp/InstitucionMaestra');
    const instituciones = await InstitucionMaestra.findAll({
      attributes: ['id', 'nombre', 'siglas'],
      order: [['nombre', 'ASC']]
    });
    return res.json(instituciones);
  } catch (error) {
    console.error('[LEGACY] Error en /usuarios/catalogos/instituciones:', error.message);
    return res.json([]);
  }
});

// NUEVO: Soporte para creación de usuarios a través del proxy legacy
router.post('/usuarios', async (req, res) => {
  const AuthController = require('../../controllers/common/AuthController');
  return AuthController.register(req, res);
});

// ═══════════════════════════════════════════════════════
//  LÍNEAS DE ACCIÓN — MSP
// ═══════════════════════════════════════════════════════

router.get('/lineasAccion', async (req, res) => {
  try {
    // 1. Obtener todas las líneas de acción de MSP
    const lineas = await LineaAccion.findAll({
      order: [['created_at', 'DESC']]
    });

    // 2. Obtener inversiones desde MUNI
    const desgloses = await PresupuestoDetalle.findAll({
      include: [{
        model: ActividadLocal,
        as: 'actividad',
        attributes: ['linea_sync_id']
      }]
    });
    
    // Mapa de inversión por ID de línea
    const inversionMap = {};
    desgloses.forEach(d => {
      const act = d.actividad;
      const lineaId = act ? (act.linea_sync_id || act.dataValues?.linea_sync_id) : null;
      if (lineaId) {
        inversionMap[lineaId] = (inversionMap[lineaId] || 0) + parseFloat(d.monto_ejecutado || 0);
      }
    });

    // 3. Fusionar datos
    const formatted = lineas.map((l, idx) => {
      const data = l.get({ plain: true });
      return {
        ...data,
        no: idx + 1,
        lineaAccion: data.titulo,
        inversionLinea: inversionMap[data.id] || 0,
        responsables: ['Fuerza Pública', 'Municipalidad'],
        institucionesLideres: [1, 2],
        completadas: 0,
        progreso: 0
      };
    });

    return res.json(formatted);
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
    const acciones = await AccionEstrategica.findAll({
      include: [{ model: KpiNacional, as: 'kpis' }],
      order: [['created_at', 'DESC']]
    });

    const actividadesLocal = await ActividadLocal.findAll({
      include: [{
        model: PresupuestoDetalle,
        as: 'presupuestos'
      }]
    });

    const budgetMap = {};
    actividadesLocal.forEach(al => {
      const spent = (al.presupuestos || []).reduce((sum, p) => sum + parseFloat(p.monto_ejecutado), 0);
      budgetMap[al.titulo.toLowerCase().trim()] = {
        total: spent || al.presupuesto_asignado || 0,
        detalles: al.presupuestos || []
      };
    });

    // Transformamos al formato que el frontend espera
    const tareas = acciones.map(a => {
      const data = a.get({ plain: true });
      const budgetData = budgetMap[data.nombre.toLowerCase().trim()] || { total: 0, detalles: [] };
      return {
        ...data,
        id: data.id,
        lineaAccionId: data.linea_id,
        titulo: data.nombre,
        descripcion: data.objetivo_especifico,
        completada: false,
        estado: 'En ejecución',
        inversionColones: budgetData.total,
        presupuestoDetalles: budgetData.detalles, // Información de en qué se gastó
        meta: 100, // Valor por defecto para cálculos de progreso
        seguimientoTipo: 'porcentaje'
      };
    });

    return res.json(tareas);
  } catch (error) {
    console.error('[LEGACY] Error en /tareas:', error.message);
    return res.json([]);
  }
});

router.get('/tareas/:id', async (req, res) => {
  try {
    const tarea = await AccionEstrategica.findByPk(req.params.id);
    if (!tarea) return res.status(404).json({ error: 'Tarea no encontrada' });
    return res.json(tarea);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/tareas', async (req, res) => {
  try {
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
    const reportes = await ReporteEvidencia.findAll({
      include: [{ model: DesgloseAsistencia, as: 'asistencia' }],
      order: [['created_at', 'DESC']]
    });

    // Aplicar filtros por query string (compatible con json-server)
    let result = reportes.map(r => {
      const asist = r.asistencia || {};
      const totalBeneficiados = (asist.ninos || 0) + (asist.jovenes || 0) + (asist.adultos || 0);
      
      return {
        ...r.dataValues,
        tareaId: r.actividad_id, // Mapeo para el frontend
        estado: r.estado_id === 3 ? 'aprobado' : 'pendiente', // Mapeo de IDs de catálogo a nombres
        beneficiados: totalBeneficiados // Campo esperado por el dashboard para calcular progreso
      };
    });
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
    const InstitucionLocal = require('../../models/muni/InstitucionLocal');
    const UsuarioLocal = require('../../models/muni/UsuarioLocal');
    const eventos = await EventoCalendario.findAll({
      include: [
        { model: UsuarioLocal, as: 'creador' },
        { model: InstitucionLocal, as: 'institucion' }
      ],
      order: [['fecha_inicio', 'ASC']]
    });
    const formatLeadingZero = (num) => String(num).padStart(2, '0');

    const mapped = eventos.map(ev => {
      const fechaInicio = new Date(ev.fecha_inicio);
      const fechaFin = ev.fecha_fin ? new Date(ev.fecha_fin) : null;

      const fechaStr = `${fechaInicio.getFullYear()}-${formatLeadingZero(fechaInicio.getMonth() + 1)}-${formatLeadingZero(fechaInicio.getDate())}`;
      const inicioStr = `${formatLeadingZero(fechaInicio.getHours())}:${formatLeadingZero(fechaInicio.getMinutes())}`;
      const finStr = fechaFin ? `${formatLeadingZero(fechaFin.getHours())}:${formatLeadingZero(fechaFin.getMinutes())}` : '';

      // Resolver categoría de forma retrocompatible
      let categoria = ev.categoria || null;
      let descripcion = ev.descripcion || '';
      if (!categoria && ev.descripcion) {
        const m = ev.descripcion.match(/^\[([^\]]+)\]\s?(.*)$/);
        if (m) {
          categoria = m[1];
          descripcion = m[2] || '';
        }
      }
      if (!categoria) {
        categoria = 'Operativa';
      }

      return {
        id: ev.id,
        titulo: ev.titulo,
        descripcion: descripcion,
        categoria: categoria,
        fecha: fechaStr,
        inicio: inicioStr,
        fin: finStr,
        creadorId: ev.creado_por,
        creadorNombre: ev.creador ? `${ev.creador.nombre} ${ev.creador.apellido}` : 'Sistema',
        institucion: ev.institucion?.nombre || '',
        participantes: ev.participantes_instituciones || []
      };
    });

    return res.json(mapped);
  } catch (error) {
    console.error('[LEGACY] Error en /eventos:', error.message);
    return res.json([]);
  }
});

router.post('/eventos', async (req, res) => {
  try {
    const EventoCalendario = require('../../models/muni/EventoCalendario');
    const { Op } = require('sequelize');
    const payload = { ...req.body };

    // 1. Mapear participantes
    if (payload.participantes && !payload.participantes_instituciones) {
      payload.participantes_instituciones = payload.participantes;
    }
    delete payload.participantes;

    // 2. Mapear fecha, inicio y fin a fecha_inicio y fecha_fin
    if (payload.fecha && payload.inicio) {
      payload.fecha_inicio = new Date(`${payload.fecha}T${payload.inicio}:00`);
    }
    if (payload.fecha && payload.fin) {
      payload.fecha_fin = new Date(`${payload.fecha}T${payload.fin}:00`);
    }

    // 3. Mapear creadorId a creado_por (Bypass para usuarios nacionales/MSP en el calendario local)
    let creadorId = req.user?.id || payload.creadorId;
    if (req.user?.nivel === 'MSP') {
      creadorId = '00000000-0000-0000-0000-000000000000'; // Usuario local de 'Sistema'
    }
    payload.creado_por = creadorId;

    // 4. Mapear institucion (nombre o siglas) a institucion_id
    let institucion_id = req.user?.institucion_id || null;
    if (!institucion_id && payload.institucion) {
      const InstitucionLocal = require('../../models/muni/InstitucionLocal');
      const inst = await InstitucionLocal.findOne({
        where: {
          [Op.or]: [
            { nombre: payload.institucion },
            { siglas: payload.institucion }
          ]
        }
      });
      if (inst) institucion_id = inst.id;
    }
    payload.institucion_id = institucion_id;

    const auditUserId = req.user?.nivel === 'MSP' ? '00000000-0000-0000-0000-000000000000' : (req.user?.id || payload.creadorId);
    const nuevo = await EventoCalendario.create(payload, { userId: auditUserId });

    // Devolver al frontend en el shape que usa (fecha/inicio/fin/categoria) de forma unificada
    return res.status(201).json({
      ...nuevo.toJSON(),
      fecha: payload.fecha,
      inicio: payload.inicio,
      fin: payload.fin,
      categoria: nuevo.categoria,
      participantes: nuevo.participantes_instituciones || [],
      creadorId: req.user?.id || payload.creadorId,
      creadorNombre: req.user?.nombre || payload.creadorNombre,
      institucion: payload.institucion
    });
  } catch (error) {
    console.error('[POST /eventos] ', error.message);
    if (error.stack) console.error(error.stack.split('\n').slice(0, 5).join('\n'));
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
