/**
 * RecordatorioFormatter.js
 *
 * Helpers puros para humanizar tiempo y fechas en español (zona CR por defecto).
 */

const { DateTime } = require('luxon');

const TZ_DEFAULT = process.env.APP_TIMEZONE || 'America/Costa_Rica';

/**
 * "Faltan 2 días", "Es mañana", "En 30 minutos", "En 5 minutos".
 * Se basa en el offset configurado del recordatorio, no en cálculo dinámico,
 * para que coincida exactamente con la cadencia (14d, 7d, ..., 5m).
 */
const formatearAvisoTiempo = (offsetMinutos) => {
  if (offsetMinutos >= 1440) {
    const dias = Math.round(offsetMinutos / 1440);
    if (dias === 1) return 'Es mañana';
    return `Faltan ${dias} días`;
  }
  if (offsetMinutos >= 60) {
    const horas = Math.round(offsetMinutos / 60);
    if (horas === 1) return 'Falta 1 hora';
    return `Faltan ${horas} horas`;
  }
  if (offsetMinutos === 1) return 'Falta 1 minuto';
  return `Faltan ${offsetMinutos} minutos`;
};

/**
 * "viernes 21 de mayo, 14:00 h" (siempre en zona local configurada).
 */
const formatearFechaHumana = (fecha, tz = TZ_DEFAULT) => {
  return DateTime.fromJSDate(new Date(fecha))
    .setZone(tz)
    .setLocale('es')
    .toFormat("EEEE d 'de' LLLL, HH:mm 'h'");
};

/**
 * Escape mínimo HTML para evitar inyección al pintar campos del evento.
 */
const escapeHtml = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[c]));

module.exports = {
  TZ_DEFAULT,
  formatearAvisoTiempo,
  formatearFechaHumana,
  escapeHtml
};
