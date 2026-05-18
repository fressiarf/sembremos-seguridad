'use strict';
const UsuarioLocal = require('../../models/muni/UsuarioLocal');

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Insertar Roles MUNI
    try {
      await queryInterface.bulkInsert('roles_local', [
        { id: 1, nombre: 'Admin Municipal', permisos: JSON.stringify(['all']) },
        { id: 2, nombre: 'Gestor Actividades', permisos: JSON.stringify(['read', 'write']) },
        { id: 3, nombre: 'Visualizador', permisos: JSON.stringify(['read']) }
      ], { ignoreDuplicates: true });
    } catch (e) {
      console.log('[SEEDER] Los roles municipales ya existen.');
    }

    const rawPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin1234';

    // 2. Insertar Usuario Sistema para Auditoría (Idempotente)
    await UsuarioLocal.findOrCreate({
      where: { id: '00000000-0000-0000-0000-000000000000' },
      defaults: {
        nombre: 'Sistema',
        apellido: 'Automático',
        email: 'sistema@sembremos.cr',
        cedula: '000000000',
        password: rawPassword,
        rol_id: 1,
        activo: true
      }
    });

    // 3. Insertar Usuario Admin Municipal (Idempotente)
    await UsuarioLocal.findOrCreate({
      where: { email: 'muni@sembremos.cr' },
      defaults: {
        id: '00000000-0000-0000-0000-000000000002',
        nombre: 'Alcaldía',
        apellido: 'Municipal Puntarenas',
        cedula: '600000001',
        password: rawPassword,
        rol_id: 1,
        activo: true
      }
    });

    // 3. Insertar Usuario Gestor (Idempotente)
    await UsuarioLocal.findOrCreate({
      where: { email: 'gestor@sembremos.cr' },
      defaults: {
        id: '00000000-0000-0000-0000-000000000003',
        nombre: 'Gestor',
        apellido: 'IAFA',
        cedula: '600000002',
        password: rawPassword,
        rol_id: 2,
        activo: true
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('usuarios_local', null, {});
    await queryInterface.bulkDelete('roles_local', null, {});
  }
};
