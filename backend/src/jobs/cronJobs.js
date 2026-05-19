const cron = require('node-cron');
const mailerService = require('./mailer');
const cleanupService = require('./cleanup');
// Aquí importaríamos el dashboardService para obtener el reporte
const { dashboardService } = require('../services/dashboardService');

class CronOrchestrator {
  init() {
    console.log('[CRON] Inicializando trabajos programados...');

    // 1. Reporte Gerencial: Día 1 de cada mes a las 8:00 AM (0 8 1 * *)
    cron.schedule('0 8 1 * *', async () => {
      console.log('[CRON] Ejecutando trabajo mensual: Reporte Gerencial');
      try {
        // En una app real, obtendríamos estadísticas desde la BD
        const data = await dashboardService.getFullDashboardData();
        const summary = {
          totalLineas: data.lineasEnriquecidas ? data.lineasEnriquecidas.length : 0,
          incidentesNuevos: data.reportes ? data.reportes.length : 0
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
