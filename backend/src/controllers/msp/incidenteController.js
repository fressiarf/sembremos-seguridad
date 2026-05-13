const { IncidenteDelictivo, ZonaRiesgo, CatTipoDelito, CatGravedad, CatEstadoCaso } = require('../../models');

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
