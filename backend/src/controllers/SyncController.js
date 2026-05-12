const SyncService = require('../services/SyncService');

/**
 * Controlador para operaciones de administración y sincronización
 */
class SyncController {
  
  /**
   * Dispara el proceso de sincronización global o por entidad
   */
  async triggerSync(req, res) {
    try {
      const lineasResult = await SyncService.syncLineasAccion();
      const instResult = await SyncService.syncInstituciones();
      
      return res.status(200).json({
        message: 'Sincronización global (Metas e Instituciones) completada',
        data: {
          ...lineasResult, // Para mantener compatibilidad con el frontend actual
          instituciones: instResult
        }
      });
    } catch (error) {
      console.error('Error en triggerSync:', error);
      return res.status(500).json({
        message: 'Error al ejecutar la sincronización',
        error: error.message
      });
    }
  }

  /**
   * Crea una nueva línea de acción en el MSP
   */
  async createLinea(req, res) {
    try {
      const LineaAccion = require('../models/msp/LineaAccion');
      const { titulo, problematica, objetivo, canton_id } = req.body;

      const nuevaLinea = await LineaAccion.create({
        titulo,
        problematica,
        objetivo_general: objetivo || 'Objetivo por definir',
        canton_id: canton_id || 1, // Asegúrate de que el cantón 1 existe en MSP_DB
        activo: true
      });

      return res.status(201).json({
        message: 'Línea de acción nacional creada con éxito',
        data: nuevaLinea
      });
    } catch (error) {
      console.error('Error al crear línea:', error);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new SyncController();
