const { LineaAccion, AccionEstrategica, KpiNacional, Canton } = require('../../models');

exports.getLineasAccion = async (req, res) => {
  try {
    const lineas = await LineaAccion.findAll({
      include: [
        {
          model: AccionEstrategica,
          as: 'acciones',
          include: [{ model: KpiNacional, as: 'kpis' }]
        },
        { model: Canton, as: 'canton' }
      ],
      order: [['created_at', 'DESC']]
    });

    return res.status(200).json({
      status: 'success',
      data: lineas,
      message: 'Jerarquía estratégica recuperada'
    });
  } catch (error) {
    console.error('Error al obtener estrategia:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

exports.createLineaAccion = async (req, res) => {
  try {
    const { titulo, problematica, objetivo_general, canton_id } = req.body;

    if (!titulo || !problematica || !objetivo_general || !canton_id) {
      return res.status(400).json({ status: 'fail', message: 'Faltan campos obligatorios' });
    }

    const nuevaLinea = await LineaAccion.create({
      titulo,
      problematica,
      objetivo_general,
      canton_id
    });

    return res.status(201).json({ status: 'success', data: nuevaLinea, message: 'Línea de acción creada' });
  } catch (error) {
    console.error('Error al crear línea de acción:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

exports.updateKpiProgreso = async (req, res) => {
  try {
    const { id } = req.params;
    const { valor_actual } = req.body;

    const kpi = await KpiNacional.findByPk(id);
    if (!kpi) {
      return res.status(404).json({ status: 'fail', message: 'KPI no encontrado' });
    }

    kpi.valor_actual = valor_actual;
    await kpi.save();

    return res.status(200).json({ status: 'success', data: kpi, message: 'Progreso de KPI actualizado' });
  } catch (error) {
    console.error('Error al actualizar KPI:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};
