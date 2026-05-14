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

    // 2. Insertar Usuario Admin Municipal inicial usando el Modelo
    await UsuarioLocal.create({
      id: '00000000-0000-0000-0000-000000000002',
      nombre: 'Admin',
      apellido: 'Municipal Puntarenas',
      cedula: '600000001', // Cédula válida (Provincia 6 = Puntarenas)
      email: 'admin@muni.cr',
      password: 'admin123', // Texto plano -> El hook lo hashea
      rol_id: 1,
      activo: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('usuarios_local', null, {});
    await queryInterface.bulkDelete('roles_local', null, {});
  }
};
