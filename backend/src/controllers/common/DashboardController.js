const LineaAccion = require('../../models/msp/LineaAccion');

class DashboardController {
  async getGlobalStats(req, res) {
    try {
      const lineas = await LineaAccion.findAll();
      return res.status(200).json(lineas || []);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getTareas(req, res) { return res.status(200).json([]); }
  async getZonas(req, res) { return res.status(200).json([]); }
  async getAlertas(req, res) { return res.status(200).json([]); }
  async getNotificaciones(req, res) { return res.status(200).json([]); }
  async getReportes(req, res) { return res.status(200).json([]); }
  async getComentarios(req, res) { return res.status(200).json([]); }
  async getPresupuesto(req, res) { return res.status(200).json([]); }
  async getFullData(req, res) { return res.status(200).json({}); }
}

module.exports = new DashboardController();
