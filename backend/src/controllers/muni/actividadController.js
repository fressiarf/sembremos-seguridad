const { ActividadLocal, HitoActividad, CatTipoActividad, CatEstadoActividad } = require('../../models');

exports.getActividades = async (req, res) => {
  try {
    const actividades = await ActividadLocal.findAll({
      include: [
        { model: CatTipoActividad, as: 'tipo' },
        { model: CatEstadoActividad, as: 'estado' },
        { model: HitoActividad, as: 'hitos' }
      ],
      order: [['created_at', 'DESC']]
    });
    return res.status(200).json({ status: 'success', data: actividades });
  } catch (error) {
    console.error('Error al obtener actividades:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

exports.createActividad = async (req, res) => {
  try {
    const { linea_sync_id, titulo, descripcion_operativa, tipo_id, estado_id, presupuesto_asignado } = req.body;
    if (!titulo || !tipo_id || !estado_id) {
      return res.status(400).json({ status: 'fail', message: 'Faltan campos obligatorios' });
    }
    const nuevaActividad = await ActividadLocal.create({
      linea_sync_id, titulo, descripcion_operativa, tipo_id, estado_id, presupuesto_asignado
    });
    return res.status(201).json({ status: 'success', data: nuevaActividad });
  } catch (error) {
    console.error('Error al crear actividad:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

exports.addHito = async (req, res) => {
  try {
    const { actividad_id, nombre_paso } = req.body;
    if (!actividad_id || !nombre_paso) {
      return res.status(400).json({ status: 'fail', message: 'actividad_id y nombre_paso son requeridos' });
    }
    const nuevoHito = await HitoActividad.create({ actividad_id, nombre_paso });
    return res.status(201).json({ status: 'success', data: nuevoHito });
  } catch (error) {
    console.error('Error al agregar hito:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};
