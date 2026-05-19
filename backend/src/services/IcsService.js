/**
 * IcsService.js
 *
 * Genera un archivo .ics (iCalendar) listo para adjuntar al correo.
 * El destinatario lo abre y se agrega a Google/Outlook/Apple Calendar.
 * UID = evento.id para que las apps de calendario hagan dedup/update.
 */

const { createEvent } = require('ics');
const { DateTime } = require('luxon');

const TZ_DEFAULT = process.env.APP_TIMEZONE || 'America/Costa_Rica';

const toIcsArray = (fecha, tz) => {
  const d = DateTime.fromJSDate(new Date(fecha)).setZone(tz);
  return [d.year, d.month, d.day, d.hour, d.minute];
};

/**
 * @param {Object} params
 * @param {Object} params.evento  - {id, titulo, descripcion, fecha_inicio, fecha_fin}
 * @param {string} [params.organizadorEmail]
 * @param {Array<{nombre,email}>} [params.attendees]
 * @param {string} [params.tz]
 * @returns {Promise<string>} contenido del .ics
 */
const generarIcs = ({ evento, organizadorEmail, attendees = [], tz = TZ_DEFAULT }) => {
  const start = toIcsArray(evento.fecha_inicio, tz);
  const endOrDuration = evento.fecha_fin
    ? { end: toIcsArray(evento.fecha_fin, tz) }
    : { duration: { hours: 1 } };

  return new Promise((resolve, reject) => {
    createEvent({
      uid: evento.id,
      title: evento.titulo,
      description: evento.descripcion || '',
      start,
      startInputType: 'local',
      startOutputType: 'local',
      ...endOrDuration,
      status: 'CONFIRMED',
      busyStatus: 'BUSY',
      method: 'REQUEST',
      productId: 'sembremos-seguridad/recordatorios',
      organizer: organizadorEmail
        ? { name: process.env.MAIL_FROM_NAME || 'Sembremos Seguridad', email: organizadorEmail }
        : undefined,
      attendees: attendees.map((a) => ({
        name: a.nombre,
        email: a.email,
        rsvp: true,
        partstat: 'NEEDS-ACTION',
        role: 'REQ-PARTICIPANT'
      }))
    }, (error, value) => {
      if (error) return reject(error);
      resolve(value);
    });
  });
};

/**
 * Helper para construir el attachment de nodemailer.
 */
const construirAdjuntoIcs = async (params) => {
  const contenido = await generarIcs(params);
  return {
    filename: 'evento.ics',
    content: contenido,
    contentType: 'text/calendar; charset=UTF-8; method=REQUEST'
  };
};

module.exports = { generarIcs, construirAdjuntoIcs };
