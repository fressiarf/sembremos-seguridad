const { Provincia, Canton, Distrito } = require('../../models');

exports.getProvincias = async (req, res) => {
  try {
    const provincias = await Provincia.findAll({
      order: [['nombre', 'ASC']]
    });
    return res.status(200).json({ status: 'success', data: provincias, message: 'Provincias recuperadas correctamente' });
  } catch (error) {
    console.error('Error al obtener provincias:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

exports.getCantonesByProvincia = async (req, res) => {
  try {
    const { provinciaId } = req.params;
    const cantones = await Canton.findAll({ where: { provincia_id: provinciaId }, order: [['nombre', 'ASC']] });
    return res.status(200).json({ status: 'success', data: cantones, message: `Cantones recuperados` });
  } catch (error) {
    console.error('Error al obtener cantones:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

exports.getDistritosByCanton = async (req, res) => {
  try {
    const { cantonId } = req.params;
    const distritos = await Distrito.findAll({ where: { canton_id: cantonId }, order: [['nombre', 'ASC']] });
    return res.status(200).json({ status: 'success', data: distritos, message: `Distritos recuperados` });
  } catch (error) {
    console.error('Error al obtener distritos:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};
