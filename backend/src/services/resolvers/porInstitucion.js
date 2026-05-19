const { Op, fn, col, where } = require('sequelize');

const resolverPorInstitucion = async (evento) => {
  const { UsuarioLocal, InstitucionLocal } = require('../../models');
  
  const destinatarios = [];

  const participantes = Array.isArray(evento?.participantes_instituciones)
    ? evento.participantes_instituciones.filter((x) => typeof x === 'string' && x.trim())
    : [];

  if (participantes.length > 0) {
    const lowered = participantes.map((p) => p.trim().toLowerCase());

    const usuarios = await UsuarioLocal.findAll({
      attributes: ['id', 'nombre', 'apellido', 'email'],
      where: {
        recibe_recordatorios: { [Op.ne]: false },
        email: { [Op.ne]: null },
        activo: true
      },
      include: [{
        model: InstitucionLocal,
        as: 'institucion',
        required: true,
        attributes: [],
        where: {
          [Op.or]: [
            where(fn('LOWER', col('institucion.nombre')), { [Op.in]: lowered }),
            where(fn('LOWER', col('institucion.siglas')), { [Op.in]: lowered })
          ]
        }
      }]
    });

    for (const u of usuarios) {
      destinatarios.push({
        nombre: `${u.nombre || ''} ${u.apellido || ''}`.trim() || u.email,
        email: u.email
      });
    }
  }

  return destinatarios;
};

module.exports = resolverPorInstitucion;
