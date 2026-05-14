'use strict';
const UsuarioFP = require('../../models/msp/UsuarioFP');
const RolFP = require('../../models/msp/RolFP');

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Insertar Roles MSP (Usamos bulkInsert para IDs fijos)
    await queryInterface.bulkInsert('roles_fp', [
      { id: 1, nombre: 'SuperAdmin', permisos: JSON.stringify(['all']) },
      { id: 2, nombre: 'Admin Institucional', permisos: JSON.stringify(['read', 'write']) },
      { id: 3, nombre: 'Analista', permisos: JSON.stringify(['read']) },
      { id: 4, nombre: 'Operativo', permisos: JSON.stringify(['read', 'report']) }
    ], {});

    const rawPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin1234';

    // 2. Insertar Usuario SuperAdmin inicial usando el Modelo
    // Esto asegura que pase por las validaciones de Cédula y Longitud de Password
    await UsuarioFP.create({
      id: '00000000-0000-0000-0000-000000000001',
      nombre: 'Super',
      apellido: 'Admin Sistema',
      cedula: '100000001', // Cédula válida de 9 dígitos
      email: 'admin@sembremos.cr',
      password: rawPassword, // Texto plano -> El hook del modelo lo hashea
      rol_id: 1,
      activo: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('usuarios_fp', null, {});
    await queryInterface.bulkDelete('roles_fp', null, {});
  }
};
