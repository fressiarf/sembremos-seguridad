/**
 * MailService.js
 *
 * Wrapper de nodemailer con pool SMTP (Gmail).
 * Carga la plantilla HTML una sola vez y la renderiza con sustitución simple {{var}}.
 */

const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const { formatearAvisoTiempo, formatearFechaHumana, escapeHtml } = require('./RecordatorioFormatter');
const { construirAdjuntoIcs } = require('./IcsService');

let transporter;
let plantillaRecordatorio;

const getTransporter = () => {
  if (transporter) return transporter;
  if (!process.env.MAIL_PASS) {
    console.warn('[MAIL] MAIL_PASS no configurado; envío de correos deshabilitado');
    return null;
  }
  transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.MAIL_PORT || '465', 10),
    secure: process.env.MAIL_SECURE !== 'false',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    },
    pool: true,
    maxConnections: 3,
    maxMessages: 50
  });
  return transporter;
};

const cargarPlantilla = () => {
  if (plantillaRecordatorio) return plantillaRecordatorio;
  const ruta = path.join(__dirname, '..', 'templates', 'recordatorio.html');
  plantillaRecordatorio = fs.readFileSync(ruta, 'utf8');
  return plantillaRecordatorio;
};

const renderizar = (tpl, vars) =>
  tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => (vars[k] !== undefined && vars[k] !== null ? vars[k] : ''));

/**
 * Constructor HTML común usado tanto por recordatorios como por confirmaciones.
 * `aviso` es el texto del encabezado (ej: "Faltan 2 días", "Nuevo evento agendado").
 */
const construirHtmlEvento = ({ aviso, evento, categoria, participantes }) => {
  const tpl = cargarPlantilla();
  const ctaUrl = `${process.env.APP_FRONTEND_URL || 'http://localhost:5173'}/calendario?evento=${evento.id}`;

  const descripcionHtml = evento.descripcion
    ? `<p style="color:#374151;line-height:1.55;margin:0 0 16px;font-size:14px;">${escapeHtml(evento.descripcion)}</p>`
    : '';

  const categoriaHtml = categoria
    ? `<tr><td style="padding:10px 0;color:#6b7280;font-size:13px;vertical-align:top;">Categoría</td><td style="padding:10px 0;color:#111827;font-size:14px;">${escapeHtml(categoria)}</td></tr>`
    : '';

  const participantesHtml = participantes && participantes.length
    ? `<tr><td style="padding:10px 0;color:#6b7280;font-size:13px;vertical-align:top;">Participantes</td><td style="padding:10px 0;color:#111827;font-size:14px;">${participantes.map(escapeHtml).join(', ')}</td></tr>`
    : '';

  return renderizar(tpl, {
    aviso: escapeHtml(aviso),
    titulo: escapeHtml(evento.titulo),
    descripcionHtml,
    fechaHumana: formatearFechaHumana(evento.fecha_inicio),
    categoriaHtml,
    participantesHtml,
    ctaUrl: escapeHtml(ctaUrl)
  });
};

const construirHtmlRecordatorio = ({ evento, offsetMinutos, categoria, participantes }) =>
  construirHtmlEvento({
    aviso: formatearAvisoTiempo(offsetMinutos),
    evento,
    categoria,
    participantes
  });

const construirHtmlConfirmacion = ({ evento, categoria, participantes }) =>
  construirHtmlEvento({
    aviso: 'Nuevo evento agendado',
    evento,
    categoria,
    participantes
  });

const construirAsunto = ({ evento, offsetMinutos }) => {
  const prefijo = formatearAvisoTiempo(offsetMinutos);
  return `[${prefijo}] ${evento.titulo}`;
};

const construirAsuntoConfirmacion = ({ evento }) => `[Nuevo evento] ${evento.titulo}`;

/**
 * Envía un correo arbitrario. Si MAIL_PASS no está configurado,
 * devuelve {skipped:true} sin lanzar — útil en dev.
 */
const sendMail = async ({ to, bcc, subject, html, text, attachments = [] }) => {
  const t = getTransporter();
  if (!t) return { skipped: true, reason: 'SMTP no configurado' };

  const from = `"${process.env.MAIL_FROM_NAME || 'Sembremos Seguridad'}" <${process.env.MAIL_USER}>`;
  const info = await t.sendMail({ from, to, bcc, subject, html, text, attachments });
  return { messageId: info.messageId, accepted: info.accepted, rejected: info.rejected };
};

/**
 * Envío de recordatorio: arma asunto, HTML y .ics, todo de una.
 * `destinatarios` es array de {nombre, email}. Se envían en BCC por privacidad.
 */
const enviarRecordatorio = async ({ evento, offsetMinutos, destinatarios, categoria, participantes }) => {
  if (!destinatarios || destinatarios.length === 0) {
    return { skipped: true, reason: 'sin destinatarios' };
  }
  const html = construirHtmlRecordatorio({ evento, offsetMinutos, categoria, participantes });
  const subject = construirAsunto({ evento, offsetMinutos });
  const ics = await construirAdjuntoIcs({
    evento,
    organizadorEmail: process.env.MAIL_USER,
    attendees: destinatarios
  });
  return sendMail({
    bcc: destinatarios.map((d) => d.email).filter(Boolean),
    subject,
    html,
    attachments: [ics]
  });
};

/**
 * Envío inmediato cuando se agenda un evento. Mismo .ics, distinto
 * encabezado y asunto. A partir de aquí los recordatorios se irán
 * disparando solos según la cadencia.
 */
const enviarConfirmacion = async ({ evento, destinatarios, categoria, participantes }) => {
  if (!destinatarios || destinatarios.length === 0) {
    return { skipped: true, reason: 'sin destinatarios' };
  }
  const html = construirHtmlConfirmacion({ evento, categoria, participantes });
  const subject = construirAsuntoConfirmacion({ evento });
  const ics = await construirAdjuntoIcs({
    evento,
    organizadorEmail: process.env.MAIL_USER,
    attendees: destinatarios
  });
  return sendMail({
    bcc: destinatarios.map((d) => d.email).filter(Boolean),
    subject,
    html,
    attachments: [ics]
  });
};

const verify = async () => {
  const t = getTransporter();
  if (!t) return false;
  await t.verify();
  return true;
};

module.exports = {
  sendMail,
  enviarRecordatorio,
  enviarConfirmacion,
  construirHtmlRecordatorio,
  construirHtmlConfirmacion,
  construirAsunto,
  construirAsuntoConfirmacion,
  verify
};
