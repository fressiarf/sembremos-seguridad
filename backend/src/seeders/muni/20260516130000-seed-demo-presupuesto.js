'use strict';
const ActividadLocal = require('../../models/muni/ActividadLocal');
const PresupuestoDetalle = require('../../models/muni/PresupuestoDetalle');
const SyncService = require('../../services/SyncService');

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log('[SEEDER] Sincronizando líneas base antes de generar presupuestos...');
    await SyncService.syncLineasAccion();
    
    console.log('[SEEDER] Generando datos de presupuesto demo en MUNI...');

    // IDs de las Líneas de Acción Sincronizadas (coincidentes con MSP)
    const lineaDrogasId = '11111111-1111-1111-1111-111111111111';
    const lineaEspaciosId = '22222222-2222-2222-2222-222222222222';

    // 1. Crear Actividades Locales (vínculo entre presupuesto y estrategia)
    const [act1] = await ActividadLocal.findOrCreate({
      where: { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' },
      defaults: {
        linea_sync_id: lineaDrogasId,
        titulo: 'Talleres de Sensibilización en Colegios',
        descripcion_operativa: 'Ejecución local de los talleres preventivos.',
        tipo_id: 1, // Capacitación
        estado_id: 2, // En proceso
        presupuesto_asignado: 2500000.00
      }
    });

    const [act2] = await ActividadLocal.findOrCreate({
      where: { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' },
      defaults: {
        linea_sync_id: lineaEspaciosId,
        titulo: 'Iluminación LED en Parque Central',
        descripcion_operativa: 'Compra e instalación de luminarias.',
        tipo_id: 2, // Infraestructura
        estado_id: 1, // Pendiente
        presupuesto_asignado: 8500000.00
      }
    });

    // 2. Crear Detalles de Presupuesto (Inversión ejecutada)
    await PresupuestoDetalle.bulkCreate([
      {
        id: Sequelize.literal('UUID()'),
        actividad_id: act1.id,
        concepto: 'Material didáctico y refrigerios',
        monto_ejecutado: 1250000.00,
        fuente_id: 1 // Fondos Municipales
      },
      {
        id: Sequelize.literal('UUID()'),
        actividad_id: act1.id,
        concepto: 'Honorarios facilitadores',
        monto_ejecutado: 750000.00,
        fuente_id: 2 // Gobierno Central
      },
      {
        id: Sequelize.literal('UUID()'),
        actividad_id: act2.id,
        concepto: 'Compra de luminarias LED solares',
        monto_ejecutado: 5000000.00,
        fuente_id: 1
      },
      {
        id: Sequelize.literal('UUID()'),
        actividad_id: act2.id,
        concepto: 'Mano de obra instalación',
        monto_ejecutado: 1500000.00,
        fuente_id: 3 // Cooperación Internacional
      }
    ], { ignoreDuplicates: true });

    console.log('[SEEDER] ✅ Datos de presupuesto generados correctamente.');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('presupuesto_detalle', null, {});
    await queryInterface.bulkDelete('actividades_local', null, {});
  }
};
