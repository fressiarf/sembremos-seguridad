const cron = require('node-cron');
const mailerService = require('./mailer');
const cleanupService = require('./cleanup');
const LineaAccion = require('../models/msp/LineaAccion');
const IncidenteDelictivo = require('../models/msp/IncidenteDelictivo');

class CronOrchestrator {
  init() {
    console.log('[CRON] Inicializando trabajos programados...');

    // 1. Reporte Gerencial: Día 1 de cada mes a las 8:00 AM (0 8 1 * *)
    cron.schedule('0 8 1 * *', async () => {
      console.log('[CRON] Ejecutando trabajo mensual: Reporte Gerencial');
      try {
        // Consultar estadísticas directamente
        const totalLineas = await LineaAccion.count().catch(() => 0);
        const incidentesNuevos = await IncidenteDelictivo.count().catch(() => 0);

        const summary = {
          totalLineas,
          incidentesNuevos
        };

        // En producción se buscaría a los usuarios con Rol "Director" o "Super Admin"
        const correosDestino = ['director_msp@seguridad.go.cr', 'alcalde_muni@muni.go.cr'];
        
        await mailerService.sendMonthlyReport(correosDestino, summary);
      } catch (error) {
        console.error('[CRON ERROR] Falló el trabajo del Reporte Gerencial:', error.message);
      }
    });

    // 2. Mantenimiento Nocturno: Todos los días a las 2:00 AM (0 2 * * *)
    cron.schedule('0 2 * * *', async () => {
      await cleanupService.runNightlyCleanup();
    });

    console.log('[CRON] Orquestador de trabajos en segundo plano activado.');
  }
}

module.exports = new CronOrchestrator();
