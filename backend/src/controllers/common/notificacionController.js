const { NotificacionFP, NotificacionLocal } = require('../../models');

exports.getMisNotificaciones = async (req, res) => {
  try {
    const { usuarioId, tipo } = req.query; // tipo: 'MSP' o 'MUNI'
    
    if (tipo === 'MSP') {
      const notifs = await NotificacionFP.findAll({ where: { usuario_id: usuarioId }, order: [['created_at', 'DESC']] });
      return res.status(200).json({ status: 'success', data: notifs });
    } else {
      const notifs = await NotificacionLocal.findAll({ where: { usuario_id: usuarioId }, order: [['created_at', 'DESC']] });
      return res.status(200).json({ status: 'success', data: notifs });
    }
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

exports.marcarLeida = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo } = req.body;
    
    const Model = tipo === 'MSP' ? NotificacionFP : NotificacionLocal;
    const notif = await Model.findByPk(id);
    
    if (!notif) return res.status(404).json({ status: 'fail', message: 'Notificación no encontrada' });
    
    notif.leida = true;
    await notif.save();
    
    return res.status(200).json({ status: 'success', message: 'Notificación marcada como leída' });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};
