const { InformeD71, FotoEvidencia, CatPeriodoTrimestral, CatEstadoInforme } = require('../../models');

exports.getInformes = async (req, res) => {
  try {
    const informes = await InformeD71.findAll({
      include: [
        { model: CatPeriodoTrimestral, as: 'periodo' },
        { model: CatEstadoInforme, as: 'estado' }
      ]
    });
    return res.status(200).json({ status: 'success', data: informes });
  } catch (error) {
    console.error('Error al obtener informes:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

exports.generarInforme = async (req, res) => {
  try {
    const { periodo_id, generado_por, resumen_ejecutivo, estado_id } = req.body;
    const nuevoInforme = await InformeD71.create({
      periodo_id, generado_por, resumen_ejecutivo, estado_id: estado_id || 1
    });
    return res.status(201).json({ status: 'success', data: nuevoInforme });
  } catch (error) {
    console.error('Error al generar informe:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

exports.subirEvidencia = async (req, res) => {
  try {
    const { reporte_id, url_archivo, comentario } = req.body;
    const nuevaEvidencia = await FotoEvidencia.create({
      reporte_id, url_archivo, comentario
    });
    return res.status(201).json({ status: 'success', data: nuevaEvidencia });
  } catch (error) {
    console.error('Error al subir evidencia:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};
