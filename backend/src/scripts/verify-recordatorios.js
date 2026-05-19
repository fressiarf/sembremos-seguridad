/**
 * src/scripts/verify-recordatorios.js
 *
 * Smoke test integral del sistema de recordatorios.
 * Verifica DB, modelos, servicios, plantilla y .ics SIN enviar correos
 * ni crear datos en la base.
 *
 * Uso:
 *   node src/scripts/verify-recordatorios.js
 *
 * Sale con código 0 si todo pasa, 1 si algo falla.
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const fs = require('fs');

const resultados = [];
const ok = (nombre, detalle = '') => resultados.push({ estado: 'OK  ', nombre, detalle });
const fail = (nombre, detalle = '') => resultados.push({ estado: 'FAIL', nombre, detalle });

const ejecutar = async (nombre, fn) => {
  try {
    const detalle = await fn();
    ok(nombre, detalle || '');
  } catch (e) {
    fail(nombre, e.message);
  }
};

(async () => {
  console.log('═'.repeat(70));
  console.log(' VERIFICACIÓN DEL SISTEMA DE RECORDATORIOS');
  console.log('═'.repeat(70));

  // ─── 1. Archivos esperados existen ─────────────────────────────
  await ejecutar('Archivos en disco', () => {
    const esperados = [
      'src/migrations/muni/20260513400001-create-evento-recordatorio.js',
      'src/models/muni/EventoRecordatorio.js',
      'src/services/RecordatorioService.js',
      'src/services/RecordatorioFormatter.js',
      'src/services/IcsService.js',
      'src/services/MailService.js',
      'src/services/DestinatariosService.js',
      'src/templates/recordatorio.html'
    ];
    const faltantes = esperados.filter((p) => !fs.existsSync(path.join(__dirname, '..', '..', p)));
    if (faltantes.length) throw new Error('Faltan: ' + faltantes.join(', '));
    return `${esperados.length} archivos presentes`;
  });

  // ─── 2. Carga de modelos sin error ─────────────────────────────
  await ejecutar('Carga de modelos Sequelize', () => {
    const db = require('../models');
    if (!db.EventoCalendario) throw new Error('Falta EventoCalendario');
    if (!db.EventoRecordatorio) throw new Error('Falta EventoRecordatorio');
    if (!db.UsuarioLocal) throw new Error('Falta UsuarioLocal');
    const asoc = Object.keys(db.EventoRecordatorio.associations);
    if (!asoc.includes('evento')) throw new Error("Falta asociación 'evento' en EventoRecordatorio");
    return `EventoCalendario, EventoRecordatorio, UsuarioLocal — asoc: ${asoc.join(',')}`;
  });

  // ─── 3. Hooks correctamente registrados ─────────────────────────
  await ejecutar('Hooks afterCreate/afterUpdate en EventoCalendario', () => {
    const db = require('../models');
    const hooks = db.EventoCalendario.options.hooks;
    if (!hooks.afterCreate) throw new Error('Falta afterCreate');
    if (!hooks.afterUpdate) throw new Error('Falta afterUpdate');
    return 'ambos hooks definidos';
  });

  // ─── 4. OFFSETS_MINUTOS coincide con la spec ─────────────────────
  await ejecutar('Cadencia OFFSETS_MINUTOS coincide con spec', () => {
    const { OFFSETS_MINUTOS } = require('../services/RecordatorioService');
    const esperado = [20160, 10080, 5760, 2880, 1440, 720, 60];
    if (JSON.stringify(OFFSETS_MINUTOS) !== JSON.stringify(esperado)) {
      throw new Error(`got=${JSON.stringify(OFFSETS_MINUTOS)} esperado=${JSON.stringify(esperado)}`);
    }
    return '14d/7d/4d/2d/1d/12h/1h';
  });

  // ─── 5. Cálculo de offsets aplicables ──────────────────────────
  await ejecutar('calcularRecordatoriosAplicables — casos borde', () => {
    const { calcularRecordatoriosAplicables } = require('../services/RecordatorioService');
    const now = new Date('2026-05-18T10:00:00Z');
    const casos = [
      { delta: 30 * 24 * 60, esperado: 7 },    // 30 días: todos (los 7)
      { delta: 3 * 24 * 60, esperado: 4 },     // 3 días: 2d/1d/12h/1h
      { delta: 90, esperado: 1 },              // 90 min: 1h
      { delta: 30, esperado: 0 },              // 30 min: ninguno (1h ya pasó)
      { delta: -60, esperado: 0 }              // pasado
    ];
    for (const c of casos) {
      const fecha = new Date(now.getTime() + c.delta * 60 * 1000);
      const res = calcularRecordatoriosAplicables(fecha, now);
      if (res.length !== c.esperado) {
        throw new Error(`delta=${c.delta}min esperado=${c.esperado} obtenido=${res.length}`);
      }
    }
    return `${casos.length} escenarios pasaron`;
  });

  // ─── 6. Wording de cadencia ─────────────────────────────────────
  await ejecutar('Wording de avisos en español', () => {
    const { formatearAvisoTiempo } = require('../services/RecordatorioFormatter');
    const esperados = {
      20160: 'Faltan 14 días',
      10080: 'Faltan 7 días',
      2880: 'Faltan 2 días',
      1440: 'Es mañana',
      720: 'Faltan 12 horas',
      60: 'Falta 1 hora'
    };
    for (const [offset, txt] of Object.entries(esperados)) {
      const got = formatearAvisoTiempo(parseInt(offset, 10));
      if (got !== txt) throw new Error(`${offset}min: esperado="${txt}" got="${got}"`);
    }
    return Object.keys(esperados).length + ' wordings correctos';
  });

  // ─── 7. Plantilla renderiza sin placeholders ────────────────────
  await ejecutar('Plantilla recordatorio.html renderiza completa', () => {
    const { construirHtmlRecordatorio, construirHtmlConfirmacion } = require('../services/MailService');
    const evento = {
      id: '00000000-0000-0000-0000-000000000000',
      titulo: 'Evento de prueba',
      descripcion: 'Descripción de prueba',
      fecha_inicio: new Date()
    };
    const htmlR = construirHtmlRecordatorio({ evento, offsetMinutos: 1440 });
    const htmlC = construirHtmlConfirmacion({ evento });
    const sobrasR = htmlR.match(/\{\{\w+\}\}/g);
    const sobrasC = htmlC.match(/\{\{\w+\}\}/g);
    if (sobrasR) throw new Error('Recordatorio con placeholders: ' + sobrasR.join(','));
    if (sobrasC) throw new Error('Confirmación con placeholders: ' + sobrasC.join(','));
    return 'ambos modos OK';
  });

  // ─── 8. Generación de .ics ──────────────────────────────────────
  await ejecutar('IcsService genera .ics válido', async () => {
    const { generarIcs } = require('../services/IcsService');
    const ics = await generarIcs({
      evento: {
        id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        titulo: 'Test',
        descripcion: 'd',
        fecha_inicio: new Date('2026-06-01T15:00:00Z')
      }
    });
    if (!ics.includes('BEGIN:VCALENDAR')) throw new Error('Falta BEGIN:VCALENDAR');
    if (!ics.includes('UID:aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')) throw new Error('UID no coincide');
    if (!ics.includes('METHOD:REQUEST')) throw new Error('Falta METHOD:REQUEST');
    return 'estructura iCalendar correcta';
  });

  // ─── 9. Conexión a BD MUNI ──────────────────────────────────────
  await ejecutar('Conexión a base de datos MUNI', async () => {
    const { sequelizeMUNI } = require('../config/database');
    await sequelizeMUNI.authenticate();
    return `host=${process.env.DB_MUNI_HOST} db=${process.env.DB_MUNI_NAME}`;
  });

  // ─── 10. Tabla eventos_recordatorios existe con columnas correctas ──
  await ejecutar('Tabla eventos_recordatorios + estructura', async () => {
    const { sequelizeMUNI } = require('../config/database');
    const [filas] = await sequelizeMUNI.query("SHOW TABLES LIKE 'eventos_recordatorios'");
    if (filas.length === 0) throw new Error("Tabla no existe — corré 'npm run migrate:muni'");
    const [cols] = await sequelizeMUNI.query('DESCRIBE eventos_recordatorios');
    const nombres = cols.map((c) => c.Field);
    const requeridas = ['id', 'evento_id', 'offset_minutos', 'programado_para', 'estado', 'enviado_en', 'intentos', 'ultimo_error'];
    const faltan = requeridas.filter((c) => !nombres.includes(c));
    if (faltan.length) throw new Error('Faltan columnas: ' + faltan.join(','));
    return `${cols.length} columnas — todas requeridas presentes`;
  });

  // ─── 11. Constraint UNIQUE y FK presentes ────────────────────────
  await ejecutar('UNIQUE(evento_id, offset_minutos) + FK CASCADE', async () => {
    const { sequelizeMUNI } = require('../config/database');
    const [idx] = await sequelizeMUNI.query("SHOW INDEX FROM eventos_recordatorios WHERE Key_name='uq_evento_offset'");
    if (idx.length < 2) throw new Error('UNIQUE compuesto no encontrado');
    const [fk] = await sequelizeMUNI.query(`
      SELECT CONSTRAINT_NAME, DELETE_RULE
      FROM information_schema.REFERENTIAL_CONSTRAINTS
      WHERE TABLE_NAME='eventos_recordatorios' AND CONSTRAINT_SCHEMA = DATABASE()
    `);
    const cascade = fk.find((f) => f.DELETE_RULE === 'CASCADE');
    if (!cascade) throw new Error('FK con ON DELETE CASCADE no encontrada');
    return 'UNIQUE + FK CASCADE OK';
  });

  // ─── 12. Estado SMTP ─────────────────────────────────────────────
  await ejecutar('Configuración SMTP (Gmail)', () => {
    const tieneUser = !!process.env.MAIL_USER;
    const tienePass = !!process.env.MAIL_PASS;
    if (!tieneUser && !tienePass) return 'NO CONFIGURADO (correos deshabilitados, ok para dev)';
    if (tieneUser && !tienePass) throw new Error('MAIL_USER seteado pero MAIL_PASS vacío');
    if (!tieneUser && tienePass) throw new Error('MAIL_PASS seteado pero MAIL_USER vacío');
    return `configurado: ${process.env.MAIL_USER}`;
  });

  // ─── Reporte ────────────────────────────────────────────────────
  console.log('─'.repeat(70));
  let pasados = 0;
  let fallidos = 0;
  for (const r of resultados) {
    const linea = ` [${r.estado}] ${r.nombre}${r.detalle ? '  ' + r.detalle : ''}`;
    console.log(linea);
    r.estado.trim() === 'OK' ? pasados++ : fallidos++;
  }
  console.log('─'.repeat(70));
  console.log(` Total: ${resultados.length}  |  OK: ${pasados}  |  FAIL: ${fallidos}`);
  console.log('═'.repeat(70));

  const { sequelizeMUNI } = require('../config/database');
  await sequelizeMUNI.close();
  process.exit(fallidos === 0 ? 0 : 1);
})().catch((err) => {
  console.error('\n ✗ Verificación abortada:', err.message);
  console.error(err);
  process.exit(1);
});
