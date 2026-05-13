const { InstitucionMaestra, CatTipoInstitucion, Canton } = require('../../models');

exports.getInstitucionesMaestras = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { count, rows } = await InstitucionMaestra.findAndCountAll({
      include: [
        { model: CatTipoInstitucion, as: 'tipo' },
        { model: Canton, as: 'canton' }
      ],
      limit, offset, order: [['nombre', 'ASC']]
    });
    return res.status(200).json({
      status: 'success',
      data: { totalItems: count, totalPages: Math.ceil(count / limit), currentPage: page, instituciones: rows },
      message: 'Instituciones recuperadas correctamente'
    });
  } catch (error) {
    console.error('Error al obtener instituciones:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

exports.createInstitucionMaestra = async (req, res) => {
  try {
    const { nombre, siglas, tipo_id, canton_id } = req.body;
    if (!nombre || !tipo_id || !canton_id) {
      return res.status(400).json({ status: 'fail', message: 'Nombre, tipo_id y canton_id son obligatorios' });
    }
    const nuevaInstitucion = await InstitucionMaestra.create({ nombre, siglas, tipo_id, canton_id });
    return res.status(201).json({ status: 'success', data: nuevaInstitucion, message: 'Institución creada correctamente' });
  } catch (error) {
    console.error('Error al crear institución:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

exports.getTiposInstitucion = async (req, res) => {
  try {
    const tipos = await CatTipoInstitucion.findAll({ order: [['nombre', 'ASC']] });
    return res.status(200).json({ status: 'success', data: tipos, message: 'Catálogo de tipos recuperado' });
  } catch (error) {
    console.error('Error al obtener tipos de institución:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};
