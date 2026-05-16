'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Cargar Provincia Puntarenas (ID: 6)
    await queryInterface.bulkInsert('provincias', [{
      id: 6,
      nombre: 'Puntarenas',
      created_at: new Date(),
      updated_at: new Date()
    }], { ignoreDuplicates: true });

    // 2. Cargar Cantón Puntarenas Central (ID: 601)
    await queryInterface.bulkInsert('cantones', [{
      id: 601,
      nombre: 'Puntarenas',
      provincia_id: 6,
      created_at: new Date(),
      updated_at: new Date()
    }], { ignoreDuplicates: true });

    // 3. Cargar Distritos del Núcleo Urbano
    await queryInterface.bulkInsert('distritos', [
      { id: 60101, nombre: 'Puntarenas Centro', canton_id: 601, created_at: new Date(), updated_at: new Date() },
      { id: 60115, nombre: 'El Roble', canton_id: 601, created_at: new Date(), updated_at: new Date() },
      { id: 60114, nombre: 'Barranca', canton_id: 601, created_at: new Date(), updated_at: new Date() },
      { id: 60113, nombre: 'Chacarita', canton_id: 601, created_at: new Date(), updated_at: new Date() }
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('distritos', { canton_id: 601 }, {});
    await queryInterface.bulkDelete('cantones', { id: 601 }, {});
    await queryInterface.bulkDelete('provincias', { id: 6 }, {});
  }
};
