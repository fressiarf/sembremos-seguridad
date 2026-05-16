'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Tipos de Delito
    await queryInterface.bulkInsert('cat_tipo_delito', [
      { id: 1, nombre: 'Homicidio', categoria: 'Contra la Vida' },
      { id: 2, nombre: 'Robo a Vivienda', categoria: 'Contra la Propiedad' },
      { id: 3, nombre: 'Asalto (Robo con Violencia)', categoria: 'Contra la Propiedad' },
      { id: 4, nombre: 'Tacha de Vehículos', categoria: 'Contra la Propiedad' },
      { id: 5, nombre: 'Narcotráfico / Venta de Drogas', categoria: 'Contra la Salud Pública' },
      { id: 6, nombre: 'Violencia Doméstica', categoria: 'Contra la Familia' },
      { id: 7, nombre: 'Hurto', categoria: 'Contra la Propiedad' }
    ], { ignoreDuplicates: true });

    // 2. Niveles de Gravedad
    await queryInterface.bulkInsert('cat_gravedad', [
      { id: 1, nombre: 'Baja', nivel: 1 },
      { id: 2, nombre: 'Media', nivel: 2 },
      { id: 3, nombre: 'Alta', nivel: 3 },
      { id: 4, nombre: 'Crítica', nivel: 4 }
    ], { ignoreDuplicates: true });

    // 3. Estados de Caso
    await queryInterface.bulkInsert('cat_estado_caso', [
      { id: 1, nombre: 'Abierto / En Reporte' },
      { id: 2, nombre: 'En Investigación' },
      { id: 3, nombre: 'Judicializado' },
      { id: 4, nombre: 'Cerrado' }
    ], { ignoreDuplicates: true });

    // 4. Clasificación de Inteligencia
    await queryInterface.bulkInsert('cat_clasificacion_intel', [
      { id: 1, nombre: 'Táctica', nivel_acceso: 1 },
      { id: 2, nombre: 'Estratégica', nivel_acceso: 3 },
      { id: 3, nombre: 'Operativa', nivel_acceso: 2 }
    ], { ignoreDuplicates: true });

    // 5. Niveles de Confianza
    await queryInterface.bulkInsert('cat_nivel_confianza', [
      { id: 1, nombre: 'Confirmada' },
      { id: 2, nombre: 'Probable' },
      { id: 3, nombre: 'Dudosa' }
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('cat_nivel_confianza', null, {});
    await queryInterface.bulkDelete('cat_clasificacion_intel', null, {});
    await queryInterface.bulkDelete('cat_estado_caso', null, {});
    await queryInterface.bulkDelete('cat_gravedad', null, {});
    await queryInterface.bulkDelete('cat_tipo_delito', null, {});
  }
};
