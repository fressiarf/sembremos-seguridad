/**
 * RecordatorioService.js
 *
 * Genera y mantiene las filas de eventos_recordatorios según la fecha de un evento.
 * Cadencia: 14d, 7d, 4d, 2d, 1d, 12h, 1h, 30m, 15m, 5m antes del inicio.
 */

const { Op } = require('sequelize');

const OFFSETS_MINUTOS = [
  14 * 24 * 60, // 14 días
  7 * 24 * 60,  // 7 días
  4 * 24 * 60,  // 4 días
  2 * 24 * 60,  // 2 días
  1 * 24 * 60,  // 1 día
  12 * 60,      // 12 horas
  60            // 1 hora — punto mínimo de aviso
];

/**
 * Devuelve los offsets que aún caen en el futuro respecto a `ahora`.
 * Si la fecha del evento ya pasó, devuelve [].
 */
const calcularRecordatoriosAplicables = (fechaInicio, ahora = new Date()) => {
  const inicioMs = new Date(fechaInicio).getTime();
  const ahoraMs = ahora.getTime();
  return OFFSETS_MINUTOS
    .map(offset => ({
      offset_minutos: offset,
      programado_para: new Date(inicioMs - offset * 60 * 1000)
    }))
    .filter(r => r.programado_para.getTime() > ahoraMs);
};

const generarRecordatorios = async (evento, options = {}) => {
  const EventoRecordatorio = require('../models/muni/EventoRecordatorio');
  const { resolverDestinatariosEvento } = require('./DestinatariosService');
  
  const destinatarios = await resolverDestinatariosEvento(evento);
  if (destinatarios.length === 0) return [];

  const offsetsAplicables = calcularRecordatoriosAplicables(evento.fecha_inicio);
  if (offsetsAplicables.length === 0) return [];

  const filas = [];
  for (const offset of offsetsAplicables) {
    for (const d of destinatarios) {
      filas.push({
        ...offset,
        evento_id: evento.id,
        destinatario_email: d.email,
        estado: 'pendiente'
      });
    }
  }

  return EventoRecordatorio.bulkCreate(filas, {
    transaction: options.transaction,
    ignoreDuplicates: true
  });
};

/**
 * Para updates: borra recordatorios aún no enviados y los recalcula
 * con la nueva fecha. Los ya 'enviado' o 'enviando' se preservan
 * (los enviados son historia; los enviando podrían estar en vuelo).
 */
const regenerarRecordatorios = async (evento, options = {}) => {
  const EventoRecordatorio = require('../models/muni/EventoRecordatorio');
  await EventoRecordatorio.destroy({
    where: {
      evento_id: evento.id,
      estado: { [Op.in]: ['pendiente', 'fallido', 'omitido'] }
    },
    transaction: options.transaction
  });
  return generarRecordatorios(evento, options);
};

module.exports = {
  OFFSETS_MINUTOS,
  calcularRecordatoriosAplicables,
  generarRecordatorios,
  regenerarRecordatorios
};
