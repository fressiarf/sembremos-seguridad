'use strict';
const UsuarioFP = require('../../models/msp/UsuarioFP');
const RolFP = require('../../models/msp/RolFP');

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Insertar Roles MSP (Evitamos duplicados con una consulta cruda o bulkInsert seguro)
    // Usamos una técnica de "UPSERT" manual o simplemente intentamos insertar ignorando errores de duplicidad
    try {
      await queryInterface.bulkInsert('roles_fp', [
        { id: 1, nombre: 'SuperAdmin', permisos: JSON.stringify(['all']) },
        { id: 2, nombre: 'Admin Institucional', permisos: JSON.stringify(['read', 'write']) },
        { id: 3, nombre: 'Analista', permisos: JSON.stringify(['read']) },
        { id: 4, nombre: 'Operativo', permisos: JSON.stringify(['read', 'report']) }
      ], { ignoreDuplicates: true });
    } catch (e) {
      console.log('[SEEDER] Los roles ya existen o hubo un problema menor al insertarlos.');
    }

    const rawPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin1234';

    // 2. Insertar Usuario SuperAdmin inicial (Idempotente)
    const [adminUser, created] = await UsuarioFP.findOrCreate({
      where: { email: 'admin@sembremos.cr' },
      defaults: {
        id: '00000000-0000-0000-0000-000000000001',
        nombre: 'Super',
        apellido: 'Admin Sistema',
        cedula: '100000001',
        password: rawPassword,
        rol_id: 1,
        activo: true
      }
    });

    if (!created) {
      console.log('[SEEDER] El usuario admin@sembremos.cr ya existe. Saltando creación.');
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('usuarios_fp', null, {});
    await queryInterface.bulkDelete('roles_fp', null, {});
  }
};
