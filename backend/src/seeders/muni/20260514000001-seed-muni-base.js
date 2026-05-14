'use strict';
const UsuarioLocal = require('../../models/muni/UsuarioLocal');

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Insertar Roles MUNI
    await queryInterface.bulkInsert('roles_local', [
      { id: 1, nombre: 'Admin Municipal', permisos: JSON.stringify(['all']) },
      { id: 2, nombre: 'Gestor Actividades', permisos: JSON.stringify(['read', 'write']) },
      { id: 3, nombre: 'Visualizador', permisos: JSON.stringify(['read']) }
    ], {});

    const rawPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin1234';

    // 2. Insertar Usuario Admin Municipal
    await UsuarioLocal.create({
      id: '00000000-0000-0000-0000-000000000002',
      nombre: 'Alcaldía',
      apellido: 'Municipal Puntarenas',
      cedula: '600000001',
      email: 'muni@sembremos.cr',
      password: rawPassword,
      rol_id: 1,
      activo: true
    });

    // 3. Insertar Usuario Gestor
    await UsuarioLocal.create({
      id: '00000000-0000-0000-0000-000000000003',
      nombre: 'Gestor',
      apellido: 'IAFA',
      cedula: '600000002',
      email: 'gestor@sembremos.cr',
      password: rawPassword,
      rol_id: 2,
      activo: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('usuarios_local', null, {});
    await queryInterface.bulkDelete('roles_local', null, {});
  }
};
