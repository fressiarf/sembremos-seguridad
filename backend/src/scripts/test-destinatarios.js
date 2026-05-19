/**
 * src/scripts/test-destinatarios.js
 *
 * Valida la resolución de destinatarios con participantes por institución.
 * Crea data de prueba aislada y la limpia al terminar.
 *
 * Cubre:
 *   1) Creador es destinatario por defecto.
 *   2) Usuarios de instituciones listadas en participantes_instituciones también.
 *   3) Match por nombre Y por siglas (case-insensitive).
 *   4) Filtro recibe_recordatorios=false excluye al usuario.
 *   5) Dedup: el creador no aparece duplicado aunque pertenezca a una institución participante.
 *
 * Uso:
 *   cd backend
 *   node src/scripts/test-destinatarios.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const { Op } = require('sequelize');
const { sequelizeMUNI } = require('../config/database');
const db = require('../models');
const { resolverDestinatariosEvento } = require('../services/DestinatariosService');

let pasados = 0;
let fallidos = 0;
const aserta = (cond, descripcion, detalle = '') => {
  if (cond) { console.log(`  ✓ ${descripcion}${detalle ? '  ' + detalle : ''}`); pasados++; }
  else { console.log(`  ✗ ${descripcion}${detalle ? '  ' + detalle : ''}`); fallidos++; }
};

const TAG = '[TEST DEST]';

(async () => {
  console.log('═'.repeat(70));
  console.log(' TEST DESTINATARIOS — resolución multi-institución');
  console.log('═'.repeat(70));

  await sequelizeMUNI.authenticate();

  let rol = await db.RolLocal.findOne();
  if (!rol) {
    console.error('  ✗ No hay RolLocal en la BD. Corré seeders: npm run seed:muni');
    await sequelizeMUNI.close();
    process.exit(1);
  }

  // Limpieza previa por si quedó data de un run anterior
  await db.UsuarioLocal.destroy({ where: { email: { [Op.like]: '%@test-dest.local' } } });
  await db.InstitucionLocal.destroy({ where: { nombre: { [Op.like]: `${TAG}%` } } });

  let creador = null, miembroInst = null, sinPref = null;
  let instTest = null, evento = null;

  try {
    // ─── Setup data ─────────────────────────────────────────────
    console.log('\n─── Setup ───');
    instTest = await db.InstitucionLocal.create({
      nombre: `${TAG} Instituto Demo`,
      siglas: 'TDEM'
    });
    console.log(`  Institución test: ${instTest.nombre} (id=${instTest.id})`);

    creador = await db.UsuarioLocal.create({
      nombre: 'TestCreador', apellido: 'Uno',
      cedula: '111111111', email: 'creador@test-dest.local',
      password: 'Test_123456789', rol_id: rol.id
    });

    miembroInst = await db.UsuarioLocal.create({
      nombre: 'TestMiembro', apellido: 'Dos',
      cedula: '222222222', email: 'miembro@test-dest.local',
      password: 'Test_123456789', rol_id: rol.id,
      institucion_id: instTest.id
    });

    sinPref = await db.UsuarioLocal.create({
      nombre: 'TestSinPref', apellido: 'Tres',
      cedula: '333333333', email: 'sinpref@test-dest.local',
      password: 'Test_123456789', rol_id: rol.id,
      institucion_id: instTest.id,
      recibe_recordatorios: false
    });
    console.log('  Usuarios test creados (creador, miembro, sinPref con notif off)');

    // ─── Test 1: resolver con participantes vacío → solo creador ─
    console.log('\n─── Test 1: sin participantes → solo creador ───');
    const ev1 = { creado_por: creador.id, participantes_instituciones: null };
    const r1 = await resolverDestinatariosEvento(ev1);
    aserta(r1.length === 1 && r1[0].email === 'creador@test-dest.local', 'devuelve solo creador', `obtuvo ${r1.length}`);

    // ─── Test 2: con participantes por nombre → creador + miembro ─
    console.log('\n─── Test 2: participantes por NOMBRE ───');
    const ev2 = { creado_por: creador.id, participantes_instituciones: [`${TAG} Instituto Demo`] };
    const r2 = await resolverDestinatariosEvento(ev2);
    const emails2 = r2.map((d) => d.email).sort();
    aserta(emails2.length === 2, 'devuelve 2 destinatarios', `obtuvo ${r2.length}: ${emails2.join(',')}`);
    aserta(emails2.includes('creador@test-dest.local'), 'incluye creador');
    aserta(emails2.includes('miembro@test-dest.local'), 'incluye miembro de institución');
    aserta(!emails2.includes('sinpref@test-dest.local'), 'EXCLUYE usuario con recibe_recordatorios=false');

    // ─── Test 3: match por SIGLAS también ────────────────────────
    console.log('\n─── Test 3: participantes por SIGLAS (case-insensitive) ───');
    const ev3 = { creado_por: creador.id, participantes_instituciones: ['tdem'] };
    const r3 = await resolverDestinatariosEvento(ev3);
    aserta(r3.length === 2, 'devuelve 2 destinatarios match siglas', `obtuvo ${r3.length}`);

    // ─── Test 4: nombre que no existe → solo creador, sin error ──
    console.log('\n─── Test 4: institución inexistente → solo creador ───');
    const ev4 = { creado_por: creador.id, participantes_instituciones: ['No Existe Inc'] };
    const r4 = await resolverDestinatariosEvento(ev4);
    aserta(r4.length === 1 && r4[0].email === 'creador@test-dest.local', 'devuelve solo creador, sin error');

    // ─── Test 5: dedup — creador miembro de institución participante ──
    console.log('\n─── Test 5: dedup cuando creador pertenece a la institución ───');
    await creador.update({ institucion_id: instTest.id });
    const ev5 = { creado_por: creador.id, participantes_instituciones: [`${TAG} Instituto Demo`] };
    const r5 = await resolverDestinatariosEvento(ev5);
    const emails5 = r5.map((d) => d.email);
    const creadorCount = emails5.filter((e) => e === 'creador@test-dest.local').length;
    aserta(creadorCount === 1, 'creador aparece exactamente una vez', `apariciones=${creadorCount}`);
    aserta(emails5.length === 2, 'total 2 destinatarios sin duplicados', `obtuvo ${emails5.length}`);
  } finally {
    // Cleanup
    if (evento) await db.EventoCalendario.destroy({ where: { id: evento.id } });
    if (creador) await db.UsuarioLocal.destroy({ where: { id: creador.id } });
    if (miembroInst) await db.UsuarioLocal.destroy({ where: { id: miembroInst.id } });
    if (sinPref) await db.UsuarioLocal.destroy({ where: { id: sinPref.id } });
    if (instTest) await db.InstitucionLocal.destroy({ where: { id: instTest.id } });
    console.log('\n  [cleanup] data de prueba eliminada');
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
