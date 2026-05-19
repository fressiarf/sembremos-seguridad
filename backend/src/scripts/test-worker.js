/**
 * src/scripts/test-worker.js
 *
 * Prueba end-to-end del worker de recordatorios contra la BD real.
 *
 * Flujo:
 *  1. Crea un usuario test si no hay ninguno.
 *  2. Crea un evento con fecha_inicio en NOW()+61min → genera 1 recordatorio a 1h
 *     cuyo programado_para queda ~1 min en el pasado al ajustarlo (ver paso 3).
 *  3. Adelanta manualmente programado_para a NOW()-1s para que el worker lo levante ya.
 *  4. Llama recordatoriosWorker.procesarRecordatorios() una vez (no espera al cron).
 *  5. Valida el estado final del recordatorio.
 *  6. Limpia evento, usuario y notificaciones in-app generadas.
 *
 * Sin MAIL_PASS:
 *  - El recordatorio queda re-encolado como 'pendiente' (estado=pendiente, intentos=0).
 *  - Esto demuestra el "fail open": no se gastan intentos por SMTP no configurado.
 *
 * Con MAIL_PASS:
 *  - El recordatorio queda 'enviado' y se crea una NotificacionLocal para el usuario.
 *
 * Uso:
 *   cd backend
 *   node src/scripts/test-worker.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const { Op } = require('sequelize');
const { sequelizeMUNI } = require('../config/database');
const db = require('../models');
const worker = require('../jobs/recordatoriosWorker');

let pasados = 0;
let fallidos = 0;
const aserta = (cond, descripcion, detalle = '') => {
  if (cond) { console.log(`  ✓ ${descripcion}${detalle ? '  ' + detalle : ''}`); pasados++; }
  else { console.log(`  ✗ ${descripcion}${detalle ? '  ' + detalle : ''}`); fallidos++; }
};

(async () => {
  console.log('═'.repeat(70));
  console.log(' TEST WORKER — flujo completo contra BD');
  console.log('═'.repeat(70));

  await sequelizeMUNI.authenticate();

  // ─── Usuario test ─────────────────────────────────────────────
  let usuario = await db.UsuarioLocal.findOne();
  let usuarioCreadoPorTest = false;
  if (!usuario) {
    const rol = await db.RolLocal.findOne();
    if (!rol) {
      console.error('  ✗ No hay roles ni usuarios. Corré seeders.');
      await sequelizeMUNI.close();
      process.exit(1);
    }
    usuario = await db.UsuarioLocal.create({
      nombre: 'TestWorker', apellido: 'Usuario',
      cedula: '999999998', email: 'test-worker@sembremos.local',
      password: 'TestWorker_2026!', rol_id: rol.id
    });
    usuarioCreadoPorTest = true;
  }
  console.log(`  Usuario test: ${usuario.email}`);

  // Limpieza previa
  await db.EventoCalendario.destroy({ where: { titulo: { [Op.like]: '[TEST WORKER]%' } } });

  let evento = null;
  try {
    // ─── Crear evento a +61 min → 1 recordatorio (offset=60) ─────────
    console.log('\n─── Setup: crear evento a +61 min ───');
    evento = await db.EventoCalendario.create({
      titulo: '[TEST WORKER] Evento de prueba',
      descripcion: 'Generado por test-worker.js',
      fecha_inicio: new Date(Date.now() + 61 * 60 * 1000),
      creado_por: usuario.id
    });
    console.log(`  Evento ${evento.id} creado`);
    await new Promise((r) => setTimeout(r, 250));

    const recs = await db.EventoRecordatorio.findAll({ where: { evento_id: evento.id } });
    aserta(recs.length === 1, `1 recordatorio generado (offset=60)`, `obtenido=${recs.length}`);
    if (recs.length !== 1) throw new Error('setup inconsistente');

    const recordatorio = recs[0];
    aserta(recordatorio.offset_minutos === 60, 'offset_minutos=60');
    aserta(recordatorio.estado === 'pendiente', 'estado inicial=pendiente');

    // ─── Adelantar programado_para a NOW()-1s para forzar al worker ──
    console.log('\n─── Setup: forzar programado_para a pasado ───');
    await db.EventoRecordatorio.update(
      { programado_para: new Date(Date.now() - 1000) },
      { where: { id: recordatorio.id } }
    );
    console.log(`  programado_para ajustado`);

    // ─── Disparar worker ─────────────────────────────────────────────
    console.log('\n─── Test: ejecutar worker manualmente ───');
    const res = await worker.procesarRecordatorios();
    aserta(res.procesados === 1, `worker procesó 1 recordatorio`, `procesados=${res.procesados}`);

    // ─── Validar estado final ────────────────────────────────────────
    const recordatorioFinal = await db.EventoRecordatorio.findByPk(recordatorio.id);
    const tieneMail = !!process.env.MAIL_PASS;

    if (tieneMail) {
      aserta(recordatorioFinal.estado === 'enviado', 'estado=enviado (con SMTP)');
      aserta(recordatorioFinal.enviado_en !== null, 'enviado_en seteado');
      // Notificación in-app debería existir
      const notifs = await db.NotificacionLocal.findAll({ where: { usuario_id: usuario.id } });
      aserta(notifs.length >= 1, `notificación in-app creada`, `cantidad=${notifs.length}`);
      // Cleanup notifs
      await db.NotificacionLocal.destroy({ where: { usuario_id: usuario.id, titulo: { [Op.like]: 'Falta 1 hora%' } } });
    } else {
      aserta(recordatorioFinal.estado === 'pendiente', 'estado=pendiente (sin SMTP, re-encolado)');
      aserta(recordatorioFinal.intentos === 0, 'intentos=0 (no se gastan por SMTP no configurado)');
      console.log('  ℹ MAIL_PASS no configurado: ver comportamiento "fail open" sin gastar intentos.');
    }

    // ─── Idempotencia: ejecutar worker otra vez ─────────────────────
    console.log('\n─── Test: idempotencia (worker corre 2da vez) ───');
    if (tieneMail) {
      const res2 = await worker.procesarRecordatorios();
      aserta(res2.procesados === 0, 'segundo barrido no reprocesa enviados');
    } else {
      // En este caso programado_para sigue en pasado y estado=pendiente, lo va a reintentar
      const res2 = await worker.procesarRecordatorios();
      aserta(res2.procesados === 1, 'segundo barrido reintenta el pendiente (esperado sin SMTP)');
    }
  } finally {
    if (evento) {
      await db.EventoCalendario.destroy({ where: { id: evento.id } });
      console.log(`\n  [cleanup] Evento eliminado`);
    }
    if (usuarioCreadoPorTest) {
      await db.NotificacionLocal.destroy({ where: { usuario_id: usuario.id } });
      await db.UsuarioLocal.destroy({ where: { id: usuario.id } });
      console.log(`  [cleanup] Usuario test eliminado`);
    }
  }

  console.log('\n' + '─'.repeat(70));
  console.log(` Total assertions: ${pasados + fallidos}  |  OK: ${pasados}  |  FAIL: ${fallidos}`);
  console.log('═'.repeat(70));

  await sequelizeMUNI.close();
  process.exit(fallidos === 0 ? 0 : 1);
})().catch(async (err) => {
  console.error('\n  ✗ Error fatal:', err.message);
  console.error(err);
  try { await sequelizeMUNI.close(); } catch {}
  process.exit(1);
});
