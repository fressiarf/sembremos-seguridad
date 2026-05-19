const { IncidenteDelictivo, ZonaRiesgo, CatTipoDelito, CatGravedad, CatEstadoCaso, NotificacionFP, UsuarioFP } = require('../../models');
const AIService = require('../../services/AIService');

exports.getIncidentes = async (req, res) => {
  try {
    const incidentes = await IncidenteDelictivo.findAll({
      include: [
        { model: ZonaRiesgo, as: 'zona' },
        { model: CatTipoDelito, as: 'tipoDelito' },
        { model: CatGravedad, as: 'gravedad' },
        { model: CatEstadoCaso, as: 'estadoCaso' }
      ],
      order: [['fecha_incidente', 'DESC']]
    });
    return res.status(200).json({ status: 'success', data: incidentes });
  } catch (error) {
    console.error('Error al obtener incidentes:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

exports.reportarIncidente = async (req, res) => {
  try {
    const { zona_id, tipo_delito_id, gravedad_id, estado_caso_id, descripcion, fecha_incidente } = req.body;
    if (!zona_id || !tipo_delito_id || !gravedad_id || !fecha_incidente) {
      return res.status(400).json({ status: 'fail', message: 'Faltan campos obligatorios' });
    }
    const nuevoIncidente = await IncidenteDelictivo.create({
      zona_id, tipo_delito_id, gravedad_id, estado_caso_id: estado_caso_id || 1, descripcion, fecha_incidente
    });

    // -------- TRIAGE INTELIGENTE (GROQ) --------
    if (descripcion) {
      try {
        const triage = await AIService.clasificarIncidente(descripcion);
        if (triage && triage.gravedad === 'ALTA') {
          // Notificar a todos los Super Administradores (rol_id: 1)
          const admins = await UsuarioFP.findAll({ where: { rol_id: 1, activo: true } });
          const notificaciones = admins.map(admin => ({
            usuario_id: admin.id,
            titulo: '🚨 ALERTA ROJA: Triage Inteligente',
            mensaje: `El modelo detectó un incidente CRÍTICO.\n\nSugerencia Táctica: ${triage.sugerencia}\n\nDescripción del hecho: ${descripcion}`
          }));
          
          if (notificaciones.length > 0) {
            await NotificacionFP.bulkCreate(notificaciones);
          }
        }
      } catch (iaError) {
        console.error('Error en el Triage Inteligente al crear notificación:', iaError);
      }
    }
    // -------------------------------------------

    return res.status(201).json({ status: 'success', data: nuevoIncidente });
  } catch (error) {
    console.error('Error al reportar incidente:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

exports.getZonasRiesgo = async (req, res) => {
  try {
    const zonas = await ZonaRiesgo.findAll();
    return res.status(200).json({ status: 'success', data: zonas });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};
