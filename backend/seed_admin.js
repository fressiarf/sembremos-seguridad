require('dotenv').config();
const { sequelizeFP, sequelizeMUNI } = require('./src/config/database');
const authHelper = require('./src/common/helpers/authHelper');
const { QueryTypes } = require('sequelize');

async function seed() {
  try {
    console.log('🚀 Iniciando sembrado de datos administrativos...');

    // 1. Hashear contraseña
    const passwordHash = await authHelper.hashPassword('Admin1234');

    // --- MSP DATABASE ---
    console.log('--- Configurando MSP (Fuerza Pública) ---');
    await sequelizeFP.authenticate();

    // Actualizar/Insertar Roles MSP (Nombres compatibles con Frontend)
    await sequelizeFP.query(`UPDATE roles_fp SET nombre = 'admin' WHERE id = 1`, { type: QueryTypes.UPDATE });
    await sequelizeFP.query(`UPDATE roles_fp SET nombre = 'institucion' WHERE id = 2`, { type: QueryTypes.UPDATE });
    
    await sequelizeFP.query(`
      INSERT IGNORE INTO roles_fp (id, nombre, permisos) VALUES 
      (1, 'admin', '{"all": true}'),
      (2, 'institucion', '{"read": true, "write": true}')
    `, { type: QueryTypes.INSERT });

    // Insertar Usuario Admin MSP
    // Usamos un UUID fijo o generado
    const adminId = 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d';
    await sequelizeFP.query(`
      INSERT IGNORE INTO usuarios_fp (id, nombre, apellido, cedula, email, password_hash, rol_id, activo, created_at, updated_at) 
      VALUES (
        '${adminId}', 
        'Administrador', 
        'Global', 
        '100000002', 
        'admin@sembremos.cr', 
        '${passwordHash}', 
        1, 
        1, 
        NOW(), 
        NOW()
      )
    `, { type: QueryTypes.INSERT });

    // --- MUNI DATABASE ---
    console.log('--- Configurando MUNI (Municipalidad) ---');
    await sequelizeMUNI.authenticate();

    // Actualizar/Insertar Roles MUNI
    await sequelizeMUNI.query(`UPDATE roles_local SET nombre = 'municipalidad' WHERE id = 1`, { type: QueryTypes.UPDATE });
    await sequelizeMUNI.query(`UPDATE roles_local SET nombre = 'gestor' WHERE id = 2`, { type: QueryTypes.UPDATE });

    await sequelizeMUNI.query(`
      INSERT IGNORE INTO roles_local (id, nombre, permisos) VALUES 
      (1, 'municipalidad', '{"all": true}'),
      (2, 'gestor', '{"read": true, "write": true}')
    `, { type: QueryTypes.INSERT });

    console.log('✅ Sembrado completado exitosamente.');
    console.log('\n--- CREDENCIALES ---');
    console.log('Email: admin@sembremos.cr');
    console.log('Password: Admin1234');
    console.log('Nivel: MSP');
    console.log('--------------------\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante el sembrado:', error.message);
    process.exit(1);
  }
}

seed();
