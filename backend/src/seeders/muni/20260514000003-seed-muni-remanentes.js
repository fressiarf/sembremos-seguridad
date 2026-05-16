'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Estados de Reporte de Evidencia
    await queryInterface.bulkInsert('cat_estado_reporte', [
      { id: 1, nombre: 'Borrador' },
      { id: 2, nombre: 'Enviado para Revisión' },
      { id: 3, nombre: 'Aprobado' },
      { id: 4, nombre: 'Rechazado (Requiere Cambios)' }
    ], { ignoreDuplicates: true });

    // 2. Tipos de Comentario
    await queryInterface.bulkInsert('cat_tipo_comentario', [
      { id: 1, nombre: 'Observación Técnica' },
      { id: 2, nombre: 'Corrección Administrativa' },
      { id: 3, nombre: 'Aprobación Final' }
    ], { ignoreDuplicates: true });

    // 3. Zonas de Ejecución (Puntarenas)
    await queryInterface.bulkInsert('cat_zona_ejecucion', [
      { id: 1, nombre: 'Zona Urbana' },
      { id: 2, nombre: 'Zona Marítimo-Terrestre' },
      { id: 3, nombre: 'Zona Comercial / Centro' }
    ], { ignoreDuplicates: true });

    // 4. Estados de Informe D71
    await queryInterface.bulkInsert('cat_estado_informe', [
      { id: 1, nombre: 'En Preparación' },
      { id: 2, nombre: 'Pendiente de Firma' },
      { id: 3, nombre: 'Presentado ante MSP' }
    ], { ignoreDuplicates: true });

    // 5. Soporte: Prioridades y Estados de Ticket
    await queryInterface.bulkInsert('cat_prioridad_ticket', [
      { id: 1, nombre: 'Baja', color_hex: '#A0A0A0' },
      { id: 2, nombre: 'Media', color_hex: '#FFFF00' },
      { id: 3, nombre: 'Alta', color_hex: '#FF8000' },
      { id: 4, nombre: 'Urgente', color_hex: '#FF0000' }
    ], { ignoreDuplicates: true });

    await queryInterface.bulkInsert('cat_estado_ticket', [
      { id: 1, nombre: 'Nuevo' },
      { id: 2, nombre: 'Asignado' },
      { id: 3, nombre: 'En Proceso' },
      { id: 4, nombre: 'Resuelto' },
      { id: 5, nombre: 'Cerrado' }
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('cat_estado_ticket', null, {});
    await queryInterface.bulkDelete('cat_prioridad_ticket', null, {});
    await queryInterface.bulkDelete('cat_estado_informe', null, {});
    await queryInterface.bulkDelete('cat_zona_ejecucion', null, {});
    await queryInterface.bulkDelete('cat_tipo_comentario', null, {});
    await queryInterface.bulkDelete('cat_estado_reporte', null, {});
  }
};
