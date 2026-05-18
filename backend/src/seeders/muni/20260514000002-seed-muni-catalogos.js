'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Tipos de Actividad Municipal
    await queryInterface.bulkInsert('cat_tipo_actividad', [
      { id: 1, nombre: 'Prevención Situacional' },
      { id: 2, nombre: 'Prevención Social' },
      { id: 3, nombre: 'Control y Vigilancia' },
      { id: 4, nombre: 'Infraestructura Urbana' },
      { id: 5, nombre: 'Capacitación y Educación' }
    ], { ignoreDuplicates: true });

    // 2. Estados de Actividad
    await queryInterface.bulkInsert('cat_estado_actividad', [
      { id: 1, nombre: 'Planificada' },
      { id: 2, nombre: 'En Ejecución' },
      { id: 3, nombre: 'Finalizada' },
      { id: 4, nombre: 'Suspendida' }
    ], { ignoreDuplicates: true });

    // 3. Fuentes de Fondos
    await queryInterface.bulkInsert('cat_fuente_fondos', [
      { id: 1, nombre: 'Presupuesto Ordinario (Muni)' },
      { id: 2, nombre: 'Transferencia Gobierno Central' },
      { id: 3, nombre: 'Donación Externa' },
      { id: 4, nombre: 'Alianza Público-Privada' }
    ], { ignoreDuplicates: true });

    // 4. Periodos Trimestrales (2026)
    await queryInterface.bulkInsert('cat_periodo_trimestral', [
      { id: 1, nombre: 'Primer Trimestre 2026', mes_inicio: 1, mes_fin: 3 },
      { id: 2, nombre: 'Segundo Trimestre 2026', mes_inicio: 4, mes_fin: 6 },
      { id: 3, nombre: 'Tercer Trimestre 2026', mes_inicio: 7, mes_fin: 9 },
      { id: 4, nombre: 'Cuarto Trimestre 2026', mes_inicio: 10, mes_fin: 12 }
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('cat_periodo_trimestral', null, {});
    await queryInterface.bulkDelete('cat_fuente_fondos', null, {});
    await queryInterface.bulkDelete('cat_estado_actividad', null, {});
    await queryInterface.bulkDelete('cat_tipo_actividad', null, {});
  }
};
