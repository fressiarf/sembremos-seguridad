const AIService = require('../../services/AIService');

exports.analizarReporte = async (req, res) => {
  try {
    const { texto } = req.body;
    if (!texto) return res.status(400).json({ status: 'fail', message: 'Se requiere texto para analizar' });
    
    const resumen = await AIService.generarResumenEjecutivo(texto);
    return res.status(200).json({ status: 'success', data: { resumen } });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.analizarIncidente = async (req, res) => {
  try {
    const { descripcion } = req.body;
    if (!descripcion) return res.status(400).json({ status: 'fail', message: 'Descripción requerida' });
    
    const analisis = await AIService.clasificarIncidente(descripcion);
    return res.status(200).json({ status: 'success', data: analisis });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};
