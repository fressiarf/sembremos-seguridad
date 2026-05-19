/**
 * src/scripts/test-mail.js
 *
 * Verifica el pipeline de correo + .ics SIN tocar la base de datos.
 *
 * Uso:
 *   node src/scripts/test-mail.js                                              # dry-run recordatorio
 *   node src/scripts/test-mail.js --modo=confirmacion                          # dry-run confirmación
 *   node src/scripts/test-mail.js destinatario@correo.com                      # envío real recordatorio
 *   node src/scripts/test-mail.js destinatario@correo.com --modo=confirmacion  # envío real confirmación
 *   node src/scripts/test-mail.js destinatario@correo.com --offset=60          # recordatorio "Falta 1 hora"
 *
 * Si no hay destinatario o MAIL_PASS no está configurado, hace un dry-run
 * y sólo escribe HTML y .ics a src/scripts/tmp/ para inspección visual.
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const fs = require('fs');

const {
  construirHtmlRecordatorio,
  construirHtmlConfirmacion,
  construirAsunto,
  construirAsuntoConfirmacion,
  enviarRecordatorio,
  enviarConfirmacion,
  verify
} = require('../services/MailService');
const { construirAdjuntoIcs } = require('../services/IcsService');

const args = process.argv.slice(2);
const destinatario = args.find((a) => !a.startsWith('--'));
const offsetArg = args.find((a) => a.startsWith('--offset='));
const modoArg = args.find((a) => a.startsWith('--modo='));

const offsetMinutos = offsetArg ? parseInt(offsetArg.split('=')[1], 10) : 1440;
const modo = modoArg ? modoArg.split('=')[1] : 'recordatorio';

if (!['recordatorio', 'confirmacion'].includes(modo)) {
  console.error(`Modo desconocido: ${modo}. Usá --modo=recordatorio o --modo=confirmacion`);
  process.exit(2);
}

const eventoFake = {
  id: '11111111-1111-1111-1111-111111111111',
  titulo: 'Reunión interinstitucional — Zona Chacarita',
  descripcion: 'Coordinación de operativo preventivo conjunto entre Fuerza Pública, IMAS y Municipalidad de Puntarenas.',
  fecha_inicio: new Date(Date.now() + offsetMinutos * 60 * 1000),
  fecha_fin: new Date(Date.now() + (offsetMinutos + 90) * 60 * 1000)
};

const participantes = ['Fuerza Pública', 'IMAS', 'Municipalidad de Puntarenas'];
const categoria = 'Reunión';

(async () => {
  console.log('═'.repeat(70));
  console.log(` TEST DE CORREO — modo: ${modo}`);
  console.log('═'.repeat(70));
  console.log(' Evento.titulo      :', eventoFake.titulo);
  console.log(' Evento.fecha_inicio:', eventoFake.fecha_inicio.toISOString());
  if (modo === 'recordatorio') {
    console.log(' Offset (min antes) :', offsetMinutos);
  }
  console.log(' Destinatario       :', destinatario || '(dry-run, no se envía)');
  console.log('─'.repeat(70));

  // 1) Renderizar HTML + asunto según modo
  const html = modo === 'confirmacion'
    ? construirHtmlConfirmacion({ evento: eventoFake, categoria, participantes })
    : construirHtmlRecordatorio({ evento: eventoFake, offsetMinutos, categoria, participantes });
  const asunto = modo === 'confirmacion'
    ? construirAsuntoConfirmacion({ evento: eventoFake })
    : construirAsunto({ evento: eventoFake, offsetMinutos });
  console.log(' Asunto :', asunto);

  // Volcar a disco para inspección visual (queda dentro de src/scripts/tmp)
  const outDir = path.join(__dirname, 'tmp');
  fs.mkdirSync(outDir, { recursive: true });
  const htmlPath = path.join(outDir, `preview-${modo}.html`);
  fs.writeFileSync(htmlPath, html);
  console.log(' HTML preview escrito en:', htmlPath);

  // 2) Generar .ics
  const adjunto = await construirAdjuntoIcs({
    evento: eventoFake,
    organizadorEmail: process.env.MAIL_FROM_ADDRESS || process.env.MAIL_USER || 'avisos@sembremos.cr',
    attendees: destinatario ? [{ nombre: 'Destinatario', email: destinatario }] : []
  });
  const icsPath = path.join(outDir, `preview-${modo}.ics`);
  fs.writeFileSync(icsPath, adjunto.content);
  console.log(' .ics escrito en        :', icsPath);

  // 3) Verificar que no quedaron placeholders sin sustituir
  const placeholdersSinResolver = html.match(/\{\{\w+\}\}/g);
  if (placeholdersSinResolver) {
    console.error(' ⚠  Placeholders sin sustituir:', placeholdersSinResolver);
    process.exit(2);
  }
  console.log(' ✓ Plantilla renderizada sin placeholders pendientes');

  // 4) Envío real si hay destinatario y SMTP configurado
  if (!destinatario) {
    console.log('─'.repeat(70));
    console.log(' Dry-run completado. Para envío real:');
    console.log(`   node src/scripts/test-mail.js tucorreo@gmail.com --modo=${modo}`);
    process.exit(0);
  }

  if (!process.env.MAIL_PASS) {
    console.log('─'.repeat(70));
    console.warn(' MAIL_PASS vacío en .env — no se envía. Configurá App Password de Gmail.');
    process.exit(0);
  }

  console.log('─'.repeat(70));
  console.log(' Verificando conexión SMTP...');
  await verify();
  console.log(' ✓ SMTP OK. Enviando correo...');

  const destinatarios = [{ nombre: 'Destinatario', email: destinatario }];
  const res = modo === 'confirmacion'
    ? await enviarConfirmacion({ evento: eventoFake, destinatarios, categoria, participantes })
    : await enviarRecordatorio({ evento: eventoFake, offsetMinutos, destinatarios, categoria, participantes });
  console.log(' ✓ Envío completado:', res);
  process.exit(0);
})().catch((err) => {
  console.error('\n ✗ Error:', err.message);
  console.error(err);
  process.exit(1);
});
