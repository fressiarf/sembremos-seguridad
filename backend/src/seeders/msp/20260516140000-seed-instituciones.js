'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log('[SEEDER] Generando catálogo de instituciones maestras...');

    // 1. Tipos de Institución
    await queryInterface.bulkInsert('cat_tipo_institucion', [
      { id: 1, nombre: 'Gubernamental' },
      { id: 2, nombre: 'Municipal' },
      { id: 3, nombre: 'Autónoma' },
      { id: 4, nombre: 'ONG' }
    ], { ignoreDuplicates: true });

    // 2. Instituciones (Singular: institucion_maestra)
    await queryInterface.bulkInsert('institucion_maestra', [
      {
        id: '00000000-0000-0000-0000-000000000001',
        nombre: 'Ministerio de Seguridad Pública',
        siglas: 'MSP',
        tipo_id: 1,
        canton_id: 601
      },
      {
        id: '00000000-0000-0000-0000-000000000002',
        nombre: 'Municipalidad de Puntarenas',
        siglas: 'MUNI',
        tipo_id: 2,
        canton_id: 601
      },
      {
        id: '00000000-0000-0000-0000-000000000003',
        nombre: 'Instituto sobre Alcoholismo y Farmacodependencia',
        siglas: 'IAFA',
        tipo_id: 3,
        canton_id: 601
      },
      {
        id: '00000000-0000-0000-0000-000000000004',
        nombre: 'Ministerio de Educación Pública',
        siglas: 'MEP',
        tipo_id: 1,
        canton_id: 601
      },
      {
        id: '00000000-0000-0000-0000-000000000005',
        nombre: 'Instituto Costarricense de Deporte y Recreación',
        siglas: 'ICODER',
        tipo_id: 3,
        canton_id: 601
      }
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('institucion_maestra', null, {});
    await queryInterface.bulkDelete('cat_tipo_institucion', null, {});
  }
};
