'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Insertar Roles MUNI
    await queryInterface.bulkInsert('roles_local', [
      { id: 1, nombre: 'Admin Municipal', permisos: JSON.stringify(['all']) },
      { id: 2, nombre: 'Gestor Actividades', permisos: JSON.stringify(['read', 'write']) },
      { id: 3, nombre: 'Visualizador', permisos: JSON.stringify(['read']) }
    ], {});

    // 2. Insertar Usuario Admin Municipal inicial
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await queryInterface.bulkInsert('usuarios_local', [{
      id: '00000000-0000-0000-0000-000000000002',
      nombre: 'Admin',
      apellido: 'Municipal',
      cedula: '200000000',
      email: 'admin@muni.cr',
      password_hash: hashedPassword,
      rol_id: 1,
      activo: true,
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('usuarios_local', null, {});
    await queryInterface.bulkDelete('roles_local', null, {});
  }
};
