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

const resolvers = [
  require('./resolvers/creador'),
  require('./resolvers/porInstitucion')
];

const resolverDestinatariosEvento = async (evento) => {
  const seen = new Set();
  const destinatarios = [];
  
  for (const resolver of resolvers) {
    const resultado = await resolver(evento);
    for (const d of resultado) {
      const key = (d.email || '').toLowerCase();
      if (key && !seen.has(key)) {
        seen.add(key);
        destinatarios.push(d);
      }
    }
  }
  
  return destinatarios;
};

module.exports = { resolverDestinatariosEvento };
