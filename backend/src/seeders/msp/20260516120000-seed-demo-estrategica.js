'use strict';
const LineaAccion = require('../../models/msp/LineaAccion');
const AccionEstrategica = require('../../models/msp/AccionEstrategica');

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log('[SEEDER] Generando datos estratégicos para el Dashboard...');
    
    // 1. Crear Líneas de Acción (usamos findOrCreate para evitar errores de duplicidad)
    const [linea1] = await LineaAccion.findOrCreate({
      where: { id: '11111111-1111-1111-1111-111111111111' },
      defaults: {
        titulo: 'Prevención del Consumo de Drogas en Jóvenes',
        problematica: 'Alta incidencia de consumo de sustancias en centros educativos de Puntarenas Centro.',
        objetivo_general: 'Reducir el índice de consumo en un 15% mediante programas preventivos.',
        canton_id: 601,
        responsable_id: '00000000-0000-0000-0000-000000000001'
      }
    });

    const [linea2] = await LineaAccion.findOrCreate({
      where: { id: '22222222-2222-2222-2222-222222222222' },
      defaults: {
        titulo: 'Recuperación de Espacios Públicos',
        problematica: 'Parques y plazas en estado de abandono propician la delincuencia común.',
        objetivo_general: 'Rehabilitar 5 espacios públicos prioritarios en el primer año.',
        canton_id: 601,
        responsable_id: '00000000-0000-0000-0000-000000000001'
      }
    });

    // 2. Crear Tareas (Acciones Estratégicas)
    await AccionEstrategica.findOrCreate({
      where: { id: '33333333-3333-3333-3333-333333333333' },
      defaults: {
        linea_id: linea1.id,
        nombre: 'Talleres de Sensibilización en Colegios',
        objetivo_especifico: 'Realizar 12 talleres mensuales en los 3 colegios principales del cantón.'
      }
    });

    await AccionEstrategica.findOrCreate({
      where: { id: '44444444-4444-4444-4444-444444444444' },
      defaults: {
        linea_id: linea1.id,
        nombre: 'Campeonatos Deportivos Relámpago',
        objetivo_especifico: 'Organizar 4 torneos de fútbol 5 los fines de semana.'
      }
    });

    await AccionEstrategica.findOrCreate({
      where: { id: '55555555-5555-5555-5555-555555555555' },
      defaults: {
        linea_id: linea2.id,
        nombre: 'Iluminación LED en Parque Central',
        objetivo_especifico: 'Instalar 20 luminarias solares de alta potencia.'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('acciones_estrategicas', null, {});
    await queryInterface.bulkDelete('lineas_accion', null, {});
  }
};
