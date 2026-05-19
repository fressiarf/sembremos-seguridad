/**
 * recordatorioAdminController.js
 *
 * Endpoints de diagnóstico para administradores globales.
 * Permite inspeccionar recordatorios por estado (típicamente 'fallido' o 'enviando' colgados).
 */

const { Op } = require('sequelize');
const EventoRecordatorio = require('../../models/muni/EventoRecordatorio');
const EventoCalendario = require('../../models/muni/EventoCalendario');

const ESTADOS_VALIDOS = ['pendiente', 'enviando', 'enviado', 'omitido', 'fallido'];

/**
 * GET /api/v1/admin/recordatorios?estado=fallido&limit=50
 *
 * Devuelve hasta `limit` recordatorios (default 50, max 200) filtrados por estado.
 * Sin `estado` devuelve los problemáticos: fallido + enviando con > 5 min de antigüedad.
 */
const listar = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ status: 'fail', message: 'solo administradores' });
    }

    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
    const estado = req.query.estado;

    let where;
    if (estado) {
      if (!ESTADOS_VALIDOS.includes(estado)) {
        return res.status(400).json({ status: 'fail', message: `estado debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}` });
      }
      where = { estado };
    } else {
      // Default: problemáticos — fallidos + enviando estancados (>5 min)
      const haceCincoMin = new Date(Date.now() - 5 * 60 * 1000);
      where = {
        [Op.or]: [
          { estado: 'fallido' },
          { estado: 'enviando', updated_at: { [Op.lt]: haceCincoMin } }
        ]
      };
    }

    const filas = await EventoRecordatorio.findAll({
      where,
      include: [{
        model: EventoCalendario, as: 'evento',
        attributes: ['id', 'titulo', 'fecha_inicio', 'creado_por']
      }],
      order: [['updated_at', 'DESC']],
      limit
    });

    return res.json({
      total: filas.length,
      filtro: estado ? { estado } : { default: 'problemáticos (fallido + enviando >5min)' },
      recordatorios: filas.map((r) => ({
        id: r.id,
        evento_id: r.evento_id,
        offset_minutos: r.offset_minutos,
        programado_para: r.programado_para,
        estado: r.estado,
        intentos: r.intentos,
        enviado_en: r.enviado_en,
        ultimo_error: r.ultimo_error,
        updated_at: r.updated_at,
        evento: r.evento && {
          id: r.evento.id,
          titulo: r.evento.titulo,
          fecha_inicio: r.evento.fecha_inicio,
          creado_por: r.evento.creado_por
        }
      }))
    });
  } catch (e) {
    console.error('[recordatorioAdminController.listar]', e.message);
    return res.status(500).json({ status: 'error', message: e.message });
  }
};

/**
 * Resumen agregado de todos los recordatorios por estado.
 * GET /api/v1/admin/recordatorios/resumen
 */
const resumen = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ status: 'fail', message: 'solo administradores' });
    }
    const { sequelizeMUNI } = require('../../config/database');
    const [filas] = await sequelizeMUNI.query(
      'SELECT estado, COUNT(*) AS total FROM eventos_recordatorios GROUP BY estado'
    );
    const conteo = ESTADOS_VALIDOS.reduce((acc, e) => ({ ...acc, [e]: 0 }), {});
    filas.forEach((f) => { conteo[f.estado] = parseInt(f.total, 10); });
    return res.json(conteo);
  } catch (e) {
    console.error('[recordatorioAdminController.resumen]', e.message);
    return res.status(500).json({ status: 'error', message: e.message });
  }
};

module.exports = { listar, resumen };
