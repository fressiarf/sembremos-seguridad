'use strict';
const ReporteEvidencia = require('../../models/muni/ReporteEvidencia');
const DesgloseAsistencia = require('../../models/muni/DesgloseAsistencia');

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log('[SEEDER] Generando reportes de evidencia demo...');

    const adminId = '00000000-0000-0000-0000-000000000000'; // Usuario Sistema
    const actDrogasId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    const actEspaciosId = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

    // 1. Reportes para Actividad de Drogas (Social - Basado en Meta)
    const [rep1] = await ReporteEvidencia.findOrCreate({
      where: { id: 'r1111111-1111-1111-1111-111111111111' },
      defaults: {
        actividad_id: actDrogasId,
        autor_id: adminId,
        descripcion_logro: 'Primer taller realizado en el Colegio de Puntarenas.',
        impacto_comunidad: '50 estudiantes sensibilizados sobre riesgos.',
        estado_id: 3 // Aprobado
      }
    });

    await DesgloseAsistencia.findOrCreate({
      where: { reporte_id: rep1.id },
      defaults: { ninos: 0, jovenes: 50, adultos: 0 }
    });

    const [rep2] = await ReporteEvidencia.findOrCreate({
      where: { id: 'r2222222-2222-2222-2222-222222222222' },
      defaults: {
        actividad_id: actDrogasId,
        autor_id: adminId,
        descripcion_logro: 'Segundo taller en Escuela de El Roble.',
        impacto_comunidad: '35 alumnos participantes.',
        estado_id: 3 // Aprobado
      }
    });

    await DesgloseAsistencia.findOrCreate({
      where: { reporte_id: rep2.id },
      defaults: { ninos: 35, jovenes: 0, adultos: 0 }
    });

    // 2. Reporte para Actividad de Espacios (Infraestructura - Basado en %)
    const [rep3] = await ReporteEvidencia.findOrCreate({
      where: { id: 'r3333333-3333-3333-3333-333333333333' },
      defaults: {
        actividad_id: actEspaciosId,
        autor_id: adminId,
        descripcion_logro: 'Instalación de postes completada al 65%.',
        impacto_comunidad: 'Mejora en la percepción de seguridad nocturna.',
        estado_id: 3 // Aprobado
      }
    });

    // Para tipo Infraestructura (2), el dashboard toma la suma de beneficiados como el % directamente
    await DesgloseAsistencia.findOrCreate({
      where: { reporte_id: rep3.id },
      defaults: { ninos: 0, jovenes: 0, adultos: 65 } 
    });

    console.log('[SEEDER] ✅ Reportes de evidencia generados.');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('desglose_asistencia', null, {});
    await queryInterface.bulkDelete('reportes_evidencia', null, {});
  }
};
