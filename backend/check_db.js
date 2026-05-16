const { UsuarioFP, UsuarioLocal } = require('./src/models');
const { sequelizeFP, sequelizeMUNI } = require('./src/config/database');

async function test() {
  try {
    await sequelizeFP.authenticate();
    const usersFP = await UsuarioFP.findAll();
    console.log('MSP Users:', usersFP.map(u => ({ email: u.email, cedula: u.cedula })));

    await sequelizeMUNI.authenticate();
    const usersMuni = await UsuarioLocal.findAll();
    console.log('MUNI Users:', usersMuni.map(u => ({ email: u.email, cedula: u.cedula })));
  } catch (err) {
    console.error('Error querying DB:', err.message);
  } finally {
    process.exit();
  }
}

test();
