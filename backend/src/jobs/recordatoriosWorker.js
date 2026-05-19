/**
 * src/jobs/recordatoriosWorker.js
 *
 * Worker cron que cada minuto:
 *  1. Busca recordatorios pendientes con programado_para <= NOW().
 *  2. Hace lock optimista (UPDATE ... WHERE estado='pendiente') antes de procesarlos
 *     — soporta varias instancias del backend sin doble envío.
 *  3. Envía el correo + adjunto .ics vía MailService.
 *  4. Crea notificaciones in-app paralelas en notificaciones_local.
 *  5. Actualiza estado: 'enviado' | 'omitido' | 'fallido' (con reintentos hasta 3).
 *
 * Si MAIL_PASS no está configurado, el recordatorio se mantiene en 'pendiente'
 * (no consume intentos) — así apenas configurás SMTP, los pendientes acumulados salen solos.
 *
 * Logging: emite líneas JSON con campos estables — fácil de grep/jq y compatible
 * con cualquier colector (Loki, CloudWatch, etc.) sin dependencia extra.
 */

const cron = require('node-cron');
const { Op } = require('sequelize');

const MAX_REINTENTOS = 3;
const LIMITE_POR_BARRIDO = 50;

let task = null;
let procesando = false;

/**
 * Logger mínimo en JSON. No requiere pino/winston.
 * @param {'info'|'warn'|'error'} level
 * @param {string} msg
 * @param {object} ctx
 */
const log = (level, msg, ctx = {}) => {
  const linea = JSON.stringify({
    ts: new Date().toISOString(),
    level,
    src: 'recordatoriosWorker',
    msg,
    ...ctx
  });
  if (level === 'error') console.error(linea);
  else console.log(linea);
};

/**
 * Procesa un recordatorio individual.
 * Asume que el lock optimista ya fue tomado (estado='enviando').
 */
const procesarUno = async (recordatorio) => {
  const EventoRecordatorio = require('../models/muni/EventoRecordatorio');
  const NotificacionLocal = require('../models/muni/NotificacionLocal');
  const UsuarioLocal = require('../models/muni/UsuarioLocal');
  const { enviarRecordatorio } = require('../services/MailService');
  const { resolverDestinatariosEvento } = require('../services/DestinatariosService');
  const { formatearAvisoTiempo } = require('../services/RecordatorioFormatter');

  const ctxBase = {
    recordatorio_id: recordatorio.id,
    evento_id: recordatorio.evento_id,
    offset_minutos: recordatorio.offset_minutos
  };
  const tInicio = Date.now();

  try {
    if (!recordatorio.evento) {
      throw new Error('evento asociado no encontrado (¿borrado?)');
    }

    const destinatarios = await resolverDestinatariosEvento(recordatorio.evento);
    if (destinatarios.length === 0) {
      await EventoRecordatorio.update(
        { estado: 'omitido', ultimo_error: 'sin destinatarios' },
        { where: { id: recordatorio.id } }
      );
      log('warn', 'omitido sin destinatarios', { ...ctxBase, latencia_ms: Date.now() - tInicio });
      return;
    }

    const res = await enviarRecordatorio({
      evento: recordatorio.evento,
      offsetMinutos: recordatorio.offset_minutos,
      destinatarios
    });

    if (res && res.skipped) {
      await EventoRecordatorio.update(
        { estado: 'pendiente' },
        { where: { id: recordatorio.id } }
      );
      log('warn', 'reencolado (SMTP no configurado)', { ...ctxBase, reason: res.reason });
      return;
    }

    await EventoRecordatorio.update(
      { estado: 'enviado', enviado_en: new Date(), ultimo_error: null },
      { where: { id: recordatorio.id } }
    );
    log('info', 'enviado', {
      ...ctxBase,
      n_destinatarios: destinatarios.length,
      latencia_ms: Date.now() - tInicio
    });

    // Notificación in-app paralela
    try {
      const titulo = `${formatearAvisoTiempo(recordatorio.offset_minutos)}: ${recordatorio.evento.titulo}`;
      const mensaje = `Recordatorio del evento "${recordatorio.evento.titulo}".`;
      for (const d of destinatarios) {
        const u = await UsuarioLocal.findOne({ where: { email: d.email }, attributes: ['id'] });
        if (u) {
          await NotificacionLocal.create({ usuario_id: u.id, titulo, mensaje });
        }
      }
    } catch (e) {
      log('error', 'in-app falló (no revierte envío)', { ...ctxBase, error: e.message });
    }
  } catch (e) {
    const nuevosIntentos = (recordatorio.intentos || 0) + 1;
    const nuevoEstado = nuevosIntentos >= MAX_REINTENTOS ? 'fallido' : 'pendiente';
    await EventoRecordatorio.update(
      { estado: nuevoEstado, intentos: nuevosIntentos, ultimo_error: e.message },
      { where: { id: recordatorio.id } }
    );
    log('error', 'envio fallido', {
      ...ctxBase,
      estado_nuevo: nuevoEstado,
      intentos: nuevosIntentos,
      max_reintentos: MAX_REINTENTOS,
      error: e.message,
      latencia_ms: Date.now() - tInicio
    });
  }
};

/**
 * Barrido completo: busca, lockea y procesa por lotes.
 * Idempotente y safe para overlap (flag `procesando`).
 */
const procesarRecordatorios = async () => {
  if (procesando) {
    log('warn', 'barrido anterior aún en curso, salto');
    return { procesados: 0, salto: true };
  }
  procesando = true;
  let procesados = 0;
  const tBarrido = Date.now();

  try {
    const EventoRecordatorio = require('../models/muni/EventoRecordatorio');
    const EventoCalendario = require('../models/muni/EventoCalendario');

    const pendientes = await EventoRecordatorio.findAll({
      where: {
        estado: 'pendiente',
        programado_para: { [Op.lte]: new Date() },
        intentos: { [Op.lt]: MAX_REINTENTOS }
      },
      include: [{ model: EventoCalendario, as: 'evento' }],
      limit: LIMITE_POR_BARRIDO,
      order: [['programado_para', 'ASC']]
    });

    if (pendientes.length === 0) {
      return { procesados: 0 };
    }

    log('info', 'barrido inicia', { pendientes: pendientes.length });

    for (const r of pendientes) {
      const [filas] = await EventoRecordatorio.update(
        { estado: 'enviando' },
        { where: { id: r.id, estado: 'pendiente' } }
      );
      if (filas === 0) continue;
      await procesarUno(r);
      procesados++;
    }

    log('info', 'barrido completo', { procesados, latencia_ms: Date.now() - tBarrido });
  } catch (e) {
    log('error', 'barrido aborto', { error: e.message, latencia_ms: Date.now() - tBarrido });
  } finally {
    procesando = false;
  }

  return { procesados };
};

const start = () => {
  if (task) {
    log('warn', 'start ignorado: worker ya corriendo');
    return;
  }
  task = cron.schedule('* * * * *', procesarRecordatorios, {
    timezone: process.env.APP_TIMEZONE || 'America/Costa_Rica'
  });
  log('info', 'worker iniciado', { intervalo: '1 min' });
};

const stop = () => {
  if (task) {
    task.stop();
    task = null;
    log('info', 'worker detenido');
  }
};

module.exports = { start, stop, procesarRecordatorios };
