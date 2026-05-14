require('dotenv').config();
const { sequelizeFP, sequelizeMUNI } = require('./src/config/database');

async function checkDB() {
  try {
    console.log('🔍 Verificando estado de las bases de datos MySQL...\n');

    // MSP Check
    const [usuariosFP] = await sequelizeFP.query('SELECT COUNT(*) as count FROM usuarios_fp');
    const [rolesFP] = await sequelizeFP.query('SELECT COUNT(*) as count FROM roles_fp');
    
    console.log('--- MSP (Fuerza Pública) ---');
    console.log(`Usuarios registrados: ${usuariosFP[0].count}`);
    console.log(`Roles configurados: ${rolesFP[0].count}`);

    // MUNI Check
    const [usuariosLocal] = await sequelizeMUNI.query('SELECT COUNT(*) as count FROM usuarios_local');
    const [rolesLocal] = await sequelizeMUNI.query('SELECT COUNT(*) as count FROM roles_local');

    console.log('\n--- MUNI (Municipalidad) ---');
    console.log(`Usuarios registrados: ${usuariosLocal[0].count}`);
    console.log(`Roles configurados: ${rolesLocal[0].count}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al verificar la base de datos:', error.message);
    process.exit(1);
  }
}

checkDB();
