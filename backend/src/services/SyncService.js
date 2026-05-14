/**
 * SyncService.js
 * 
 * Servicio centralizado de sincronización entre las bases de datos MSP y MUNI.
 * 
 * Flujos de datos:
 *   MSP → MUNI:
 *     - LineaAccion       → LineaAccionSync  (réplica de solo lectura)
 *     - InstitucionMaestra → InstitucionLocal (espejo de instituciones)
 *     - KpiNacional       → KpiLocalSync     (indicadores para dashboard municipal)
 *   
 *   MUNI → MSP:
 *     - UsuarioLocal       → UsuarioFP (mirror de acceso, manejado en hooks del modelo)
 */

class SyncService {

  /**
   * Sincroniza las Líneas de Acción desde MSP hacia MUNI.
   * Se ejecuta automáticamente via hooks en LineaAccion (afterCreate/afterUpdate).
   * También puede lanzarse manualmente desde el panel de administración.
   * 
   * @returns {Object} Reporte de la operación
   */
  async syncLineasAccion() {
    try {
      console.log('[SYNC] Iniciando sincronización de Líneas de Acción (MSP → MUNI)...');

      const LineaAccion = require('../models/msp/LineaAccion');
      const LineaAccionSync = require('../models/muni/LineaAccionSync');

      // 1. Obtener todas las líneas de acción de MSP
      const mspLineas = await LineaAccion.findAll();

      let creados = 0;
      let actualizados = 0;
      const detallado = [];

      // 2. Mapear y replicar en MUNI
      for (const linea of mspLineas) {
        const [instance, created] = await LineaAccionSync.upsert({
          id: linea.id,
          titulo: linea.titulo,
          problematica: linea.problematica,
          objetivo_general: linea.objetivo_general
        });

        if (created) {
          creados++;
          detallado.push({ titulo: linea.titulo, estado: 'Nuevo' });
        } else {
          actualizados++;
        }
      }

      console.log(`[SYNC] Líneas completado: ${creados} nuevos, ${actualizados} actualizados de ${mspLineas.length} total.`);

      return {
        success: true,
        entity: 'LineasAccion',
        stats: { creados, actualizados, total: mspLineas.length },
        detallado,
        hasChanges: creados > 0
      };
    } catch (error) {
      console.error('[SYNC ERROR] syncLineasAccion:', error.message);
      return { success: false, entity: 'LineasAccion', error: error.message };
    }
  }

  /**
   * Sincroniza el catálogo de instituciones desde MSP hacia MUNI.
   * 
   * Nota: InstitucionMaestra (MSP, UUID) → InstitucionLocal (MUNI)
   * CatEntidadSistema es un catálogo simple (INTEGER PK) y NO es el destino correcto
   * para un mirror de instituciones con UUID. Usamos InstitucionLocal.
   * 
   * @returns {Object} Reporte de la operación
   */
  async syncInstituciones() {
    try {
      console.log('[SYNC] Iniciando sincronización de Instituciones (MSP → MUNI)...');

      const InstitucionMaestra = require('../models/msp/InstitucionMaestra');
      const InstitucionLocal = require('../models/muni/InstitucionLocal');

      const instituciones = await InstitucionMaestra.findAll();
      let creadas = 0;
      let actualizadas = 0;

      for (const inst of instituciones) {
        const [instance, created] = await InstitucionLocal.upsert({
          id: inst.id,
          nombre: inst.nombre,
          siglas: inst.siglas || null
        });

        if (created) {
          creadas++;
        } else {
          actualizadas++;
        }
      }

      console.log(`[SYNC] Instituciones completado: ${creadas} nuevas, ${actualizadas} actualizadas de ${instituciones.length} total.`);

      return {
        success: true,
        entity: 'Instituciones',
        stats: { creados: creadas, actualizados: actualizadas, total: instituciones.length },
        hasChanges: creadas > 0
      };
    } catch (error) {
      console.error('[SYNC ERROR] syncInstituciones:', error.message);
      return { success: false, entity: 'Instituciones', error: error.message };
    }
  }

  /**
   * Sincroniza los KPIs Nacionales desde MSP hacia MUNI.
   * Desnormaliza el nombre de la acción estratégica para evitar JOINs cross-database.
   * 
   * @returns {Object} Reporte de la operación
   */
  async syncKpis() {
    try {
      console.log('[SYNC] Iniciando sincronización de KPIs (MSP → MUNI)...');

      const KpiNacional = require('../models/msp/KpiNacional');
      const AccionEstrategica = require('../models/msp/AccionEstrategica');
      const KpiLocalSync = require('../models/muni/KpiLocalSync');

      const kpis = await KpiNacional.findAll({
        include: [{ model: AccionEstrategica, as: 'accion', attributes: ['nombre'] }]
      });

      let creados = 0;
      let actualizados = 0;

      for (const kpi of kpis) {
        const [instance, created] = await KpiLocalSync.upsert({
          id: kpi.id,
          accion_nombre: kpi.accion ? kpi.accion.nombre : 'Sin acción',
          nombre_indicador: kpi.nombre_indicador,
          valor_meta: kpi.valor_meta,
          valor_actual: kpi.valor_actual
        });

        if (created) creados++;
        else actualizados++;
      }

      console.log(`[SYNC] KPIs completado: ${creados} nuevos, ${actualizados} actualizados de ${kpis.length} total.`);

      return {
        success: true,
        entity: 'KPIs',
        stats: { creados, actualizados, total: kpis.length },
        hasChanges: creados > 0
      };
    } catch (error) {
      console.error('[SYNC ERROR] syncKpis:', error.message);
      return { success: false, entity: 'KPIs', error: error.message };
    }
  }

  /**
   * Ejecuta TODAS las sincronizaciones en paralelo.
   * Usado por el botón de "Sincronizar Ahora" del panel de administración.
   * 
   * @returns {Object} Reporte consolidado
   */
  async syncAll() {
    console.log('[SYNC] ════════════════════════════════════════');
    console.log('[SYNC] Ejecutando sincronización completa...');
    console.log('[SYNC] ════════════════════════════════════════');

    const inicio = Date.now();

    const [lineas, instituciones, kpis] = await Promise.allSettled([
      this.syncLineasAccion(),
      this.syncInstituciones(),
      this.syncKpis()
    ]);

    const duracion = Date.now() - inicio;

    const resultados = {
      lineasAccion: lineas.status === 'fulfilled' ? lineas.value : { success: false, error: lineas.reason?.message },
      instituciones: instituciones.status === 'fulfilled' ? instituciones.value : { success: false, error: instituciones.reason?.message },
      kpis: kpis.status === 'fulfilled' ? kpis.value : { success: false, error: kpis.reason?.message }
    };

    const totalExitosos = Object.values(resultados).filter(r => r.success).length;
    const totalFallidos = Object.values(resultados).filter(r => !r.success).length;

    console.log(`[SYNC] Completado en ${duracion}ms — ${totalExitosos} exitosos, ${totalFallidos} fallidos`);

    return {
      success: totalFallidos === 0,
      timestamp: new Date().toISOString(),
      duracionMs: duracion,
      resumen: { exitosos: totalExitosos, fallidos: totalFallidos },
      resultados
    };
  }
}

module.exports = new SyncService();
