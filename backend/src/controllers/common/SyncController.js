const SyncService = require('../../services/SyncService');

/**
 * Controlador de Sincronización MSP ↔ MUNI
 * 
 * Endpoints administrativos para lanzar sincronizaciones manuales.
 */
class SyncController {

  /**
   * POST /api/v1/system/sync/lineas
   * Sincroniza las Líneas de Acción desde MSP hacia MUNI.
   */
  async syncLineas(req, res) {
    try {
      const resultado = await SyncService.syncLineasAccion();
      const status = resultado.success ? 200 : 500;
      res.status(status).json({ message: 'Sincronización de Líneas completada', data: resultado });
    } catch (error) {
      console.error('[SYNC CTRL] Error en syncLineas:', error);
      res.status(500).json({ message: 'Error en sincronización', error: error.message });
    }
  }

  /**
   * POST /api/v1/system/sync/instituciones
   * Sincroniza las Instituciones desde MSP hacia MUNI.
   */
  async syncInstituciones(req, res) {
    try {
      const resultado = await SyncService.syncInstituciones();
      const status = resultado.success ? 200 : 500;
      res.status(status).json({ message: 'Sincronización de Instituciones completada', data: resultado });
    } catch (error) {
      console.error('[SYNC CTRL] Error en syncInstituciones:', error);
      res.status(500).json({ message: 'Error en sincronización', error: error.message });
    }
  }

  /**
   * POST /api/v1/system/sync/all
   * Ejecuta TODAS las sincronizaciones.
   * Usado por el botón "Sincronizar Ahora" de AdminSync.jsx.
   */
  async syncAll(req, res) {
    try {
      const resultado = await SyncService.syncAll();
      const status = resultado.success ? 200 : 207;
      res.status(status).json({ message: 'Sincronización completa ejecutada', data: resultado });
    } catch (error) {
      console.error('[SYNC CTRL] Error en syncAll:', error);
      res.status(500).json({ message: 'Error en sincronización general', error: error.message });
    }
  }

  /**
   * POST /api/v1/system/sync/kpis
   * Sincroniza los KPIs Nacionales desde MSP hacia MUNI.
   */
  async syncKpis(req, res) {
    try {
      const resultado = await SyncService.syncKpis();
      const status = resultado.success ? 200 : 500;
      res.status(status).json({ message: 'Sincronización de KPIs completada', data: resultado });
    } catch (error) {
      console.error('[SYNC CTRL] Error en syncKpis:', error);
      res.status(500).json({ message: 'Error en sincronización', error: error.message });
    }
  }

  /**
   * POST /api/v1/system/sync/lineas/create
   * Crea una nueva Línea de Acción (disparará sync automático vía hooks).
   */
  async createLinea(req, res) {
    try {
      const LineaAccion = require('../../models/msp/LineaAccion');
      const { titulo, problematica, objetivo, canton_id } = req.body;
      const nuevaLinea = await LineaAccion.create({
        titulo,
        problematica,
        objetivo_general: objetivo || 'Objetivo por definir',
        canton_id: canton_id || 1
      });
      return res.status(201).json({ message: 'Línea de acción creada', data: nuevaLinea });
    } catch (error) {
      console.error('[SYNC CTRL] Error al crear línea:', error);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new SyncController();
