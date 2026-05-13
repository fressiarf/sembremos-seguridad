const { InstitucionLocal, RolLocal } = require('../../models');

exports.getInstitucionesLocales = async (req, res) => {
  try {
    const instituciones = await InstitucionLocal.findAll({
      where: { activa: true },
      order: [['nombre', 'ASC']]
    });
    
    return res.status(200).json({
      status: 'success',
      data: instituciones,
      message: 'Instituciones locales recuperadas'
    });
  } catch (error) {
    console.error('Error al obtener instituciones locales:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor'
    });
  }
};

exports.getRolesLocales = async (req, res) => {
  try {
    const roles = await RolLocal.findAll({
      order: [['nombre', 'ASC']]
    });
    
    return res.status(200).json({
      status: 'success',
      data: roles,
      message: 'Roles locales recuperados'
    });
  } catch (error) {
    console.error('Error al obtener roles locales:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor'
    });
  }
};
