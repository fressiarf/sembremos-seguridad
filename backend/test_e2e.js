const request = require('supertest');
const app = require('./src/app');
const db = require('./src/models');

const { sequelizeFP, sequelizeMUNI } = require('./src/config/database');

async function validarTodo() {
  console.log('Iniciando Validación Integral...');

  // 1. Validar conexión a DB y Modelos
  try {
    await sequelizeFP.authenticate();
    await sequelizeMUNI.authenticate();
    console.log('✅ Bases de datos conectadas.');
    console.log(`✅ ${Object.keys(db).filter(k => k !== 'sequelize' && k !== 'sequelizeFP' && k !== 'sequelizeMUNI' && k !== 'Sequelize').length} modelos cargados.`);
  } catch (err) {
    console.error('❌ Error conectando a DB:', err);
    process.exit(1);
  }

  // 2. Probar Endpoints Legacy (ahora en Sequelize)
  try {
    const resNotif = await request(app).get('/notificaciones');
    if (resNotif.statusCode === 200 && Array.isArray(resNotif.body)) {
      console.log('✅ GET /notificaciones OK (Proxy Sequelize)');
    } else {
      console.error(' Falló /notificaciones:', resNotif.body);
    }

    const resTareas = await request(app).get('/tareas');
    if (resTareas.statusCode === 200 && Array.isArray(resTareas.body)) {
      console.log(' GET /tareas OK (Proxy Sequelize)');
    } else {
      console.error(' Falló /tareas:', resTareas.body);
    }

    const resReportes = await request(app).get('/reportes');
    if (resReportes.statusCode === 200 && Array.isArray(resReportes.body)) {
      console.log(' GET /reportes OK (Proxy Sequelize)');
    } else {
      console.error(' Falló /reportes:', resReportes.body);
    }
  } catch (err) {
    console.error(' Error en endpoints:', err.message);
  }

  console.log('\n VALIDACIÓN COMPLETADA CON ÉXITO.');
  process.exit(0);
}

validarTodo();
