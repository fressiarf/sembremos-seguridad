/**
 * DestinatariosService.js
 *
 * Resuelve la lista de destinatarios (email) para un evento.
 * Combina:
 *   1) Creador del evento (siempre, si tiene email + recibe_recordatorios).
 *   2) Usuarios cuyo `institucion.nombre` o `institucion.siglas` matchea alguno
 *      de los nombres listados en `evento.participantes_instituciones`.
 *
 * Filtro: `recibe_recordatorios !== false`. Dedup por email case-insensitive.
 */

const { Op, fn, col, where } = require('sequelize');

const resolverDestinatariosEvento = async (evento) => {
  const UsuarioLocal = require('../models/muni/UsuarioLocal');
  const InstitucionLocal = require('../models/muni/InstitucionLocal');

  const destinatarios = [];

  // 1) Creador
  if (evento && evento.creado_por) {
    const creador = await UsuarioLocal.findByPk(evento.creado_por, {
      attributes: ['id', 'nombre', 'apellido', 'email', 'recibe_recordatorios']
    });
    if (creador && creador.email && creador.recibe_recordatorios !== false) {
      destinatarios.push({
        nombre: `${creador.nombre || ''} ${creador.apellido || ''}`.trim() || creador.email,
        email: creador.email
      });
    }
  }

  // 2) Usuarios de instituciones participantes (si las hay)
  const participantes = Array.isArray(evento?.participantes_instituciones)
    ? evento.participantes_instituciones.filter((x) => typeof x === 'string' && x.trim())
    : [];

  if (participantes.length > 0) {
    const lowered = participantes.map((p) => p.trim().toLowerCase());

    const usuarios = await UsuarioLocal.findAll({
      attributes: ['id', 'nombre', 'apellido', 'email'],
      where: {
        recibe_recordatorios: { [Op.ne]: false },
        email: { [Op.ne]: null }
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

  // Dedup por email (case-insensitive)
  const seen = new Set();
  return destinatarios.filter((d) => {
    const key = (d.email || '').toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

module.exports = { resolverDestinatariosEvento };
