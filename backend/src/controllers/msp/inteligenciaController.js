const { InteligenciaTactica, ZonaRiesgo, CatClasificacionIntel, CatNivelConfianza } = require('../../models');

exports.getInformesIntel = async (req, res) => {
  try {
    const informes = await InteligenciaTactica.findAll({
      include: [
        { model: ZonaRiesgo, as: 'zona' },
        { model: CatClasificacionIntel, as: 'clasificacion' },
        { model: CatNivelConfianza, as: 'confianza' }
      ],
      order: [['created_at', 'DESC']]
    });
    return res.status(200).json({ status: 'success', data: informes });
  } catch (error) {
    console.error('Error al obtener inteligencia:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

exports.registrarHallazgo = async (req, res) => {
  try {
    const { zona_id, clasificacion_id, confianza_id, hallazgo, fuente, analista_id } = req.body;
    if (!zona_id || !clasificacion_id || !hallazgo || !analista_id) {
      return res.status(400).json({ status: 'fail', message: 'Faltan campos obligatorios' });
    }
    const nuevoInforme = await InteligenciaTactica.create({
      zona_id, clasificacion_id, confianza_id, hallazgo, fuente, analista_id
    });
    return res.status(201).json({ status: 'success', data: nuevoInforme });
  } catch (error) {
    console.error('Error al registrar inteligencia:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};
