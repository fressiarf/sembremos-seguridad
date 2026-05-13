const { LineaAccion } = require('../models/msp/LineaAccion');
const { LineaAccionSync } = require('../models/muni/LineaAccionSync');
const { Provincia } = require('../models/msp/Provincia');
// Podríamos agregar más modelos aquí según sea necesario

/**
 * Servicio encargado de la sincronización de datos entre MSP y MUNI
 */
class SyncService {
  
  /**
   * Sincroniza las Líneas de Acción desde MSP hacia MUNI
   * @returns {Object} Reporte de la operación
   */
  async syncLineasAccion() {
    try {
      console.log('Iniciando sincronización de Líneas de Acción...');
      
      // 1. Obtener todas las líneas de acción de MSP
      // Nota: Importamos los modelos directamente para asegurar que usan la conexión correcta
      const mspLineas = await require('../models/msp/LineaAccion').findAll();
      
      let creados = 0;
      let actualizados = 0;

      const detallado = [];

      // 2. Mapear y replicar en MUNI
      for (const linea of mspLineas) {
        const [instance, created] = await require('../models/muni/LineaAccionSync').upsert({
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
          // Solo lo agregamos al reporte si queremos ver que se verificó, 
          // pero para limpiar el reporte, no lo agregaremos a 'detallado' si no es nuevo.
        }
      }

      return {
        success: true,
        entity: 'LineasAccion',
        stats: { creados, actualizados, total: mspLineas.length },
        detallado: detallado, // Solo contiene los nuevos de esta vuelta
        hasChanges: creados > 0
      };
    } catch (error) {
      console.error('Error en syncLineasAccion:', error);
      throw error;
    }
  }

  /**
   * Sincroniza el catálogo de instituciones desde MSP a MUNI
   */
  async syncInstituciones() {
    try {
      const CatMSP = require('../models/msp/InstitucionMaestra');
      const CatMUNI = require('../models/muni/CatEntidadSistema');

      const instituciones = await CatMSP.findAll();
      let creadas = 0;

      for (const inst of instituciones) {
        await CatMUNI.upsert({
          id: inst.id,
          nombre: inst.nombre,
          siglas: inst.siglas,
          activo: inst.activo
        });
        creadas++;
      }

      console.log(`Sincronización de instituciones completada: ${creadas} procesadas.`);
      return { success: true, entity: 'Instituciones', total: instituciones.length, creadas };
    } catch (error) {
      console.error('Error sincronizando instituciones:', error);
      throw error;
    }
  }
}

module.exports = new SyncService();
