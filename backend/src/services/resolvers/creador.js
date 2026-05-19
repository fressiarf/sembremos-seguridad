const resolverCreador = async (evento) => {
  const { UsuarioLocal } = require('../../models');
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

  return destinatarios;
};

module.exports = resolverCreador;
