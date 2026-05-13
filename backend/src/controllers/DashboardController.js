const LineaAccion = require('../models/msp/LineaAccion');

class DashboardController {
  
  // Este endpoint DEBE devolver un Array para que muniService.js no explote
  async getGlobalStats(req, res) {
    try {
      const lineas = await LineaAccion.findAll();
      // Si es un SuperAdmin pidiendo stats, podrías devolver un objeto, 
      // pero para compatibilidad con MuniDashboard, devolveremos el array.
      return res.status(200).json(lineas || []);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Aseguramos que todos devuelvan Arrays
  async getTareas(req, res) { return res.json([]); }
  async getZonas(req, res) { return res.json([]); }
  async getAlertas(req, res) { return res.json([]); }
  async getNotificaciones(req, res) { return res.json([]); }
  async getReportes(req, res) { return res.json([]); }
  async getComentarios(req, res) { return res.json([]); }
  
  // Presupuesto puede ser objeto porque no se le hace .filter() en el front
  async getPresupuesto(req, res) { return res.json({ asignado: 0, ejecutado: 0 }); }
  
  async getFullData(req, res) {
    try {
      const lineas = await LineaAccion.findAll();
      return res.json({
        lineas: lineas || [],
        stats: { total: lineas.length, completadas: 0 }
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new DashboardController();
