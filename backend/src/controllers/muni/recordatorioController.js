/**
 * recordatorioController.js
 *
 * Endpoints del usuario para:
 *   - Listar sus recordatorios próximos (los que aún no se enviaron).
 *   - Leer/actualizar su preferencia recibe_recordatorios.
 *
 * El "usuario" se identifica por req.user (inyectado por authMiddleware).
 */

const { Op } = require('sequelize');
const EventoRecordatorio = require('../../models/muni/EventoRecordatorio');
const EventoCalendario = require('../../models/muni/EventoCalendario');
const UsuarioLocal = require('../../models/muni/UsuarioLocal');

/**
 * GET /api/v1/muni/recordatorios/proximos
 *
 * Devuelve hasta 20 recordatorios pendientes del usuario actual, ordenados
 * por fecha del evento. Hoy "destinatario" = creador del evento (v1).
 */
const proximos = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'no autenticado' });
    }

    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 50);

    const filas = await EventoRecordatorio.findAll({
      where: {
        estado: { [Op.in]: ['pendiente', 'enviando'] }
      },
      include: [{
        model: EventoCalendario,
        as: 'evento',
        required: true,
        where: { creado_por: req.user.id }
      }],
      order: [[{ model: EventoCalendario, as: 'evento' }, 'fecha_inicio', 'ASC']],
      limit
    });

    const resultado = filas.map((r) => ({
      id: r.id,
      evento_id: r.evento_id,
      offset_minutos: r.offset_minutos,
      programado_para: r.programado_para,
      estado: r.estado,
      evento: {
        id: r.evento.id,
        titulo: r.evento.titulo,
        descripcion: r.evento.descripcion,
        fecha_inicio: r.evento.fecha_inicio,
        fecha_fin: r.evento.fecha_fin
      }
    }));

    return res.json(resultado);
  } catch (e) {
    console.error('[recordatorioController.proximos]', e.message);
    return res.status(500).json({ error: e.message });
  }
};

/**
 * GET /api/v1/muni/usuarios/me/preferencias
 */
const obtenerPreferencias = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'no autenticado' });
    }
    const user = await UsuarioLocal.findByPk(req.user.id, {
      attributes: ['id', 'email', 'recibe_recordatorios']
    });
    if (!user) return res.status(404).json({ error: 'usuario no encontrado' });
    return res.json({
      recibe_recordatorios: user.recibe_recordatorios !== false
    });
  } catch (e) {
    console.error('[recordatorioController.obtenerPreferencias]', e.message);
    return res.status(500).json({ error: e.message });
  }
};

/**
 * PATCH /api/v1/muni/usuarios/me/preferencias
 * Body: { recibe_recordatorios: true|false }
 */
const actualizarPreferencias = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'no autenticado' });
    }
    const { recibe_recordatorios } = req.body;
    if (typeof recibe_recordatorios !== 'boolean') {
      return res.status(400).json({ error: 'recibe_recordatorios debe ser boolean' });
    }
    const user = await UsuarioLocal.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'usuario no encontrado' });

    await user.update({ recibe_recordatorios }, { userId: req.user.id });
    return res.json({ recibe_recordatorios: user.recibe_recordatorios });
  } catch (e) {
    console.error('[recordatorioController.actualizarPreferencias]', e.message);
    return res.status(500).json({ error: e.message });
  }
};

module.exports = { proximos, obtenerPreferencias, actualizarPreferencias };
