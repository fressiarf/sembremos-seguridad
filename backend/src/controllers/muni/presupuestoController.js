const { PresupuestoDetalle, ActividadLocal, CatFuenteFondos } = require('../../models');

exports.getPresupuestos = async (req, res) => {
  try {
    const presupuestos = await PresupuestoDetalle.findAll({
      include: [
        { model: ActividadLocal, as: 'actividad' },
        { model: CatFuenteFondos, as: 'fuente' }
      ]
    });
    return res.status(200).json({ status: 'success', data: presupuestos });
  } catch (error) {
    console.error('Error al obtener presupuestos:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

exports.addGasto = async (req, res) => {
  try {
    const { actividad_id, concepto, monto_ejecutado, fuente_id } = req.body;
    if (!actividad_id || !concepto || !monto_ejecutado || !fuente_id) {
      return res.status(400).json({ status: 'fail', message: 'Faltan campos obligatorios' });
    }
    const nuevoGasto = await PresupuestoDetalle.create({
      actividad_id, concepto, monto_ejecutado, fuente_id
    });
    return res.status(201).json({ status: 'success', data: nuevoGasto });
  } catch (error) {
    console.error('Error al registrar gasto:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};
