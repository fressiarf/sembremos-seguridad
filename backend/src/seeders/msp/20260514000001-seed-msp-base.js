'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Insertar Roles MSP
    await queryInterface.bulkInsert('roles_fp', [
      { id: 1, nombre: 'SuperAdmin', permisos: JSON.stringify(['all']) },
      { id: 2, nombre: 'Admin Institucional', permisos: JSON.stringify(['read', 'write']) },
      { id: 3, nombre: 'Analista', permisos: JSON.stringify(['read']) },
      { id: 4, nombre: 'Operativo', permisos: JSON.stringify(['read', 'report']) }
    ], {});

    // 2. Insertar Usuario SuperAdmin inicial
    const hashedPassword = await bcrypt.hash('Sembremos.2026*', 10);
    
    await queryInterface.bulkInsert('usuarios_fp', [{
      id: '00000000-0000-0000-0000-000000000001',
      nombre: 'Super',
      apellido: 'Admin Sistema',
      cedula: '100000000',
      email: 'super@sembremosseguridad.go.cr',
      password_hash: hashedPassword,
      rol_id: 1,
      activo: true,
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('usuarios_fp', null, {});
    await queryInterface.bulkDelete('roles_fp', null, {});
  }
};
