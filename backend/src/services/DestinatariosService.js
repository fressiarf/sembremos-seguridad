/**
 * DestinatariosService.js
 *
 * Resuelve la lista de destinatarios (email) para un evento.
 * v1: sólo el creador del evento.
 *
 * Extensión futura (cuando exista persistencia de participantes y de
 * institucion_id en UsuarioLocal): agregar todos los usuarios cuya
 * institución esté en evento.participantes_instituciones.
 */

const resolverDestinatariosEvento = async (evento) => {
  const UsuarioLocal = require('../models/muni/UsuarioLocal');
  const destinatarios = [];

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
