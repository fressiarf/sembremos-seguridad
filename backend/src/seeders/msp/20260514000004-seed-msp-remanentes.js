'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Veredictos (Para Inteligencia)
    await queryInterface.bulkInsert('cat_veredicto', [
      { id: 1, nombre: 'Positivo / Confirmado' },
      { id: 2, nombre: 'Negativo / Descartado' },
      { id: 3, nombre: 'En Revisión' }
    ], { ignoreDuplicates: true });

    // 2. Tipos de Alerta
    await queryInterface.bulkInsert('cat_tipo_alerta', [
      { id: 1, nombre: 'Seguridad Ciudadana' },
      { id: 2, nombre: 'Operativo Policial' },
      { id: 3, nombre: 'Informativa' }
    ], { ignoreDuplicates: true });

    // 3. Prioridades (Nacional)
    await queryInterface.bulkInsert('cat_prioridad', [
      { id: 1, nombre: 'Muy Baja', color_hex: '#A0A0A0', orden: 1 },
      { id: 2, nombre: 'Baja', color_hex: '#00FF00', orden: 2 },
      { id: 3, nombre: 'Media', color_hex: '#FFFF00', orden: 3 },
      { id: 4, nombre: 'Alta', color_hex: '#FF8000', orden: 4 },
      { id: 5, nombre: 'Muy Alta', color_hex: '#FF0000', orden: 5 }
    ], { ignoreDuplicates: true });

    // 4. Categorías de Documentos
    await queryInterface.bulkInsert('cat_categoria_doc', [
      { id: 1, nombre: 'Estrategia Nacional' },
      { id: 2, nombre: 'Manual de Operaciones' },
      { id: 3, nombre: 'Anexo de Inteligencia' }
    ], { ignoreDuplicates: true });

    // 5. Tipos de Notificación MSP
    await queryInterface.bulkInsert('cat_tipo_notif_fp', [
      { id: 1, nombre: 'Alerta de Seguridad' },
      { id: 2, nombre: 'Asignación de Tarea' },
      { id: 3, nombre: 'Mensaje de IA' }
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('cat_tipo_notif_fp', null, {});
    await queryInterface.bulkDelete('cat_categoria_doc', null, {});
    await queryInterface.bulkDelete('cat_prioridad', null, {});
    await queryInterface.bulkDelete('cat_tipo_alerta', null, {});
    await queryInterface.bulkDelete('cat_veredicto', null, {});
  }
};
