const ActividadLocal = require('../../models/muni/ActividadLocal');
const ReporteEvidencia = require('../../models/muni/ReporteEvidencia');
const PresupuestoDetalle = require('../../models/muni/PresupuestoDetalle');

class ActividadService {
  /**
   * Intenta cerrar una actividad (marcarla como finalizada).
   * Regla de Negocio: No se puede cerrar si no tiene al menos un reporte de evidencia aprobado.
   */
  static async cerrarActividad(actividadId, transaction = null) {
    const actividad = await ActividadLocal.findByPk(actividadId, { transaction });
    if (!actividad) throw new Error('Actividad no encontrada');

    if (actividad.estado_id === 3) {
      throw new Error('La actividad ya se encuentra cerrada');
    }

    // Buscar reportes aprobados (estado_id = 3 suele ser aprobado)
    const reportesAprobados = await ReporteEvidencia.count({
      where: { actividad_id: actividadId, estado_id: 3 },
      transaction
    });

    if (reportesAprobados === 0) {
      throw new Error('No se puede cerrar una actividad sin reportes de evidencia aprobados');
    }

    // 3 representa estado Terminado/Cerrado
    actividad.estado_id = 3; 
    await actividad.save({ transaction });
    
    return actividad;
  }

  /**
   * Calcula el porcentaje de avance financiero de una actividad.
   * Regla de Negocio: Avance = (Presupuesto Ejecutado / Presupuesto Asignado) * 100
   */
  static async calcularAvanceFinanciero(actividadId, transaction = null) {
    const actividad = await ActividadLocal.findByPk(actividadId, {
      include: [{ model: PresupuestoDetalle, as: 'presupuestos' }],
      transaction
    });

    if (!actividad) throw new Error('Actividad no encontrada');
    if (actividad.presupuesto_asignado <= 0) return 0;

    let ejecutado = 0;
    if (actividad.presupuestos && actividad.presupuestos.length > 0) {
      ejecutado = actividad.presupuestos.reduce((acc, curr) => acc + parseFloat(curr.monto_ejecutado || 0), 0);
    }

    const avance = (ejecutado / parseFloat(actividad.presupuesto_asignado)) * 100;
    return Math.min(Math.round(avance * 100) / 100, 100); // Max 100%, 2 decimales
  }
}

module.exports = ActividadService;
