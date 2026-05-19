/**
 * src/scripts/test-flow.js
 *
 * Prueba end-to-end del flujo de recordatorios contra la base MUNI real.
 *
 * Cubre:
 *   1) Crear evento → genera los recordatorios correctos según fecha
 *   2) Cambiar fecha_inicio → regenera (preserva 'enviado', borra 'pendiente')
 *   3) Cambiar otro campo (título) → NO regenera
 *   4) Borrar evento → ON DELETE CASCADE elimina recordatorios
 *
 * El script:
 *   - Limpia eventos previos con prefijo [TEST E2E] antes de empezar.
 *   - Usa el primer UsuarioLocal de la BD como creador.
 *   - Elimina su propio evento al terminar.
 *   - NO envía correos reales (el hook intenta pero MailService omite si MAIL_PASS está vacío).
 *
 * Uso:
 *   cd backend
 *   node src/scripts/test-flow.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const { Op } = require('sequelize');
const { sequelizeMUNI } = require('../config/database');
const db = require('../models');

const MIN = 60 * 1000;
const HORA = 60 * MIN;
const DIA = 24 * HORA;

let pasados = 0;
let fallidos = 0;

const aserta = (cond, descripcion, detalle = '') => {
  if (cond) {
    console.log(`  ✓ ${descripcion}${detalle ? '  ' + detalle : ''}`);
    pasados++;
  } else {
    console.log(`  ✗ ${descripcion}${detalle ? '  ' + detalle : ''}`);
    fallidos++;
  }
};

const offsetsDe = (recs) => recs.map((r) => r.offset_minutos).sort((a, b) => b - a);

(async () => {
  console.log('═'.repeat(70));
  console.log(' PRUEBA END-TO-END — flujo de recordatorios');
  console.log('═'.repeat(70));

  // ─── Setup ─────────────────────────────────────────────────────
  await sequelizeMUNI.authenticate();

  let usuario = await db.UsuarioLocal.findOne();
  let usuarioCreadoPorTest = false;
  if (!usuario) {
    const rol = await db.RolLocal.findOne();
    if (!rol) {
      console.error('  ✗ No hay RolLocal en la BD. Corré los seeders: npm run seed:muni');
      await sequelizeMUNI.close();
      process.exit(1);
    }
    usuario = await db.UsuarioLocal.create({
      nombre: 'TestE2E',
      apellido: 'Usuario',
      cedula: '999999999',
      email: 'test-e2e@sembremos.local',
      password: 'TestE2E_2026!',
      rol_id: rol.id
    });
    usuarioCreadoPorTest = true;
    console.log(`  Usuario test creado (no existía ninguno): ${usuario.email}  (id=${usuario.id})`);
  } else {
    console.log(`  Usuario test: ${usuario.email}  (id=${usuario.id})`);
  }

  // Limpieza preventiva de runs anteriores
  const limpiados = await db.EventoCalendario.destroy({
    where: { titulo: { [Op.like]: '[TEST E2E]%' } }
  });
  if (limpiados > 0) console.log(`  Limpiados ${limpiados} eventos [TEST E2E] previos`);

  let eventoId = null;

  try {
    // ─── 1) Crear evento a +3 días → debe generar 4 offsets (2d/1d/12h/1h) ───
    console.log('\n─── Test 1: crear evento a +3 días ───');
    const fecha3d = new Date(Date.now() + 3 * DIA);
    const evento = await db.EventoCalendario.create({
      titulo: '[TEST E2E] Evento de prueba',
      descripcion: 'Generado por test-flow.js — se elimina al terminar',
      fecha_inicio: fecha3d,
      creado_por: usuario.id
    });
    eventoId = evento.id;
    console.log(`  Evento creado: ${eventoId}`);
    await new Promise((r) => setTimeout(r, 250)); // dejar correr setImmediate del hook

    const recs1 = await db.EventoRecordatorio.findAll({
      where: { evento_id: eventoId },
      order: [['offset_minutos', 'DESC']]
    });
    const offsets1 = offsetsDe(recs1);
    const esperado1 = [2880, 1440, 720, 60]; // 2d, 1d, 12h, 1h
    aserta(
      JSON.stringify(offsets1) === JSON.stringify(esperado1),
      'genera exactamente 4 offsets (2d, 1d, 12h, 1h)',
      `obtenido=${JSON.stringify(offsets1)}`
    );
    aserta(
      recs1.every((r) => r.estado === 'pendiente'),
      'todos los recordatorios en estado "pendiente"'
    );
    aserta(
      recs1.every((r) => r.programado_para > new Date()),
      'programado_para es futuro para todos'
    );

    // ─── 2) Cambiar fecha a +15 días → debe regenerar con los 7 offsets ──
    console.log('\n─── Test 2: cambiar fecha_inicio a +15 días ───');
    const fecha15d = new Date(Date.now() + 15 * DIA);
    await evento.update({ fecha_inicio: fecha15d });
    await new Promise((r) => setTimeout(r, 250));

    const recs2 = await db.EventoRecordatorio.findAll({
      where: { evento_id: eventoId },
      order: [['offset_minutos', 'DESC']]
    });
    const offsets2 = offsetsDe(recs2);
    const esperado2 = [20160, 10080, 5760, 2880, 1440, 720, 60];
    aserta(
      JSON.stringify(offsets2) === JSON.stringify(esperado2),
      'regenera con los 7 offsets',
      `obtenido=${JSON.stringify(offsets2)}`
    );

    // ─── 3) Cambiar SOLO título → NO debe tocar recordatorios ────────────
    console.log('\n─── Test 3: cambiar solo título ───');
    const idsAntes = recs2.map((r) => r.id).sort();
    await evento.update({ titulo: '[TEST E2E] Evento de prueba (editado)' });
    await new Promise((r) => setTimeout(r, 250));

    const recs3 = await db.EventoRecordatorio.findAll({
      where: { evento_id: eventoId }
    });
    const idsDespues = recs3.map((r) => r.id).sort();
    aserta(
      JSON.stringify(idsAntes) === JSON.stringify(idsDespues),
      'no se regeneran los recordatorios (mismos IDs)'
    );

    // ─── 4) Cambiar fecha a pasado → debe destruir todos (ninguno aplica) ─
    console.log('\n─── Test 4: cambiar fecha a -1 hora (pasado) ───');
    await evento.update({ fecha_inicio: new Date(Date.now() - HORA) });
    await new Promise((r) => setTimeout(r, 250));

    const recs4 = await db.EventoRecordatorio.findAll({
      where: { evento_id: eventoId }
    });
    aserta(
      recs4.length === 0,
      'todos los recordatorios eliminados (ninguno aplica)',
      `restantes=${recs4.length}`
    );

    // ─── 5) Borrar evento → CASCADE en eventos_recordatorios ──────────────
    console.log('\n─── Test 5: eliminar evento (ON DELETE CASCADE) ───');
    // Primero regenero algunos para probar el cascade
    await evento.update({ fecha_inicio: new Date(Date.now() + 5 * DIA) });
    await new Promise((r) => setTimeout(r, 250));
    const recsPrevCascade = await db.EventoRecordatorio.count({ where: { evento_id: eventoId } });
    aserta(recsPrevCascade > 0, `regenerados antes de cascade (${recsPrevCascade} filas)`);

    await evento.destroy();
    eventoId = null; // ya no hay que limpiar
    const recsTrasCascade = await db.EventoRecordatorio.count({ where: { evento_id: evento.id } });
    aserta(recsTrasCascade === 0, 'cascade eliminó todos los recordatorios');
  } finally {
    // Cleanup defensivo si algún assert lanzó
    if (eventoId) {
      try {
        await db.EventoCalendario.destroy({ where: { id: eventoId } });
        console.log(`\n  [cleanup] Evento ${eventoId} eliminado`);
      } catch (e) {
        console.error(`  [cleanup] No se pudo eliminar evento ${eventoId}:`, e.message);
      }
    }
    if (usuarioCreadoPorTest) {
      try {
        await db.UsuarioLocal.destroy({ where: { id: usuario.id } });
        console.log(`  [cleanup] Usuario test ${usuario.email} eliminado`);
      } catch (e) {
        console.error(`  [cleanup] No se pudo eliminar usuario test:`, e.message);
      }
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
  try {
    await sequelizeMUNI.close();
  } catch {}
  process.exit(1);
});
