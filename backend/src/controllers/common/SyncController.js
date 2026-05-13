const SyncService = require('../../services/SyncService');

class SyncController {
  async triggerSync(req, res) {
    try {
      const lineasResult = await SyncService.syncLineasAccion();
      const instResult = await SyncService.syncInstituciones();
      return res.status(200).json({
        message: 'Sincronización global completada',
        data: { ...lineasResult, instituciones: instResult }
      });
    } catch (error) {
      console.error('Error en triggerSync:', error);
      return res.status(500).json({ message: 'Error en la sincronización', error: error.message });
    }
  }

  async createLinea(req, res) {
    try {
      const LineaAccion = require('../../models/msp/LineaAccion');
      const { titulo, problematica, objetivo, canton_id } = req.body;
      const nuevaLinea = await LineaAccion.create({
        titulo,
        problematica,
        objetivo_general: objetivo || 'Objetivo por definir',
        canton_id: canton_id || 1,
        activo: true
      });
      return res.status(201).json({ message: 'Línea de acción creada', data: nuevaLinea });
    } catch (error) {
      console.error('Error al crear línea:', error);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new SyncController();
