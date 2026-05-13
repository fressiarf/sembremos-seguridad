const { Provincia, Canton, Distrito } = require('../models');

exports.getProvincias = async (req, res) => {
  try {
    const provincias = await Provincia.findAll({
      order: [['nombre', 'ASC']]
    });
    
    return res.status(200).json({
      status: 'success',
      data: provincias,
      message: 'Provincias recuperadas correctamente'
    });
  } catch (error) {
    console.error('Error al obtener provincias:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor al recuperar provincias'
    });
  }
};

exports.getCantonesByProvincia = async (req, res) => {
  try {
    const { provinciaId } = req.params;
    
    if (!provinciaId) {
      return res.status(400).json({
        status: 'fail',
        message: 'El ID de la provincia es requerido'
      });
    }

    const cantones = await Canton.findAll({
      where: { provincia_id: provinciaId },
      order: [['nombre', 'ASC']]
    });

    return res.status(200).json({
      status: 'success',
      data: cantones,
      message: `Cantones de la provincia ${provinciaId} recuperados`
    });
  } catch (error) {
    console.error('Error al obtener cantones:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor al recuperar cantones'
    });
  }
};

exports.getDistritosByCanton = async (req, res) => {
  try {
    const { cantonId } = req.params;
    
    if (!cantonId) {
      return res.status(400).json({
        status: 'fail',
        message: 'El ID del cantón es requerido'
      });
    }

    const distritos = await Distrito.findAll({
      where: { canton_id: cantonId },
      order: [['nombre', 'ASC']]
    });

    return res.status(200).json({
      status: 'success',
      data: distritos,
      message: `Distritos del cantón ${cantonId} recuperados`
    });
  } catch (error) {
    console.error('Error al obtener distritos:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor al recuperar distritos'
    });
  }
};
