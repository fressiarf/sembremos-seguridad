const BASE_URL = 'http://localhost:5000';

/**
 * Servicio de Alertas por Vencimiento
 * Escanea las tareas y genera alertas automáticas basadas en fechaLimite.
 */
export const alertasService = {

  /**
   * Clasifica una tarea según su proximidad al vencimiento.
   * @returns {'vencida' | 'proxima' | 'normal'}
   */
  clasificarUrgencia: (fechaLimite) => {
    if (!fechaLimite) return 'normal';
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const limite = new Date(fechaLimite + 'T00:00:00');
    const diffDias = Math.ceil((limite - hoy) / (1000 * 60 * 60 * 24));

    if (diffDias < 0) return 'vencida';
    if (diffDias <= 7) return 'proxima';
    return 'normal';
  },

  /**
   * Calcula los días de diferencia (positivo = quedan días, negativo = vencida hace X días)
   */
  diasRestantes: (fechaLimite) => {
    if (!fechaLimite) return null;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const limite = new Date(fechaLimite + 'T00:00:00');
    return Math.ceil((limite - hoy) / (1000 * 60 * 60 * 24));
  },

  /**
   * Genera texto legible de la urgencia
   */
  textoUrgencia: (dias) => {
    if (dias === null) return '';
    if (dias < 0) return `Vencida hace ${Math.abs(dias)} día${Math.abs(dias) !== 1 ? 's' : ''}`;
    if (dias === 0) return 'Vence HOY';
    if (dias === 1) return 'Vence MAÑANA';
    return `Vence en ${dias} días`;
  },

  /**
   * Obtiene todas las tareas del servidor y genera alertas de vencimiento.
   * @returns {Array} Lista de alertas generadas automáticamente.
   */
  generarAlertasVencimiento: async () => {
    try {
      const res = await fetch(`${BASE_URL}/tareas`);
      if (!res.ok) return [];
      const tareas = await res.json();

      const alertas = [];

      tareas.forEach(tarea => {
        // Solo alertar tareas que NO están completadas
        if (tarea.estado === 'Completado' || tarea.completada) return;

        const urgencia = alertasService.clasificarUrgencia(tarea.fechaLimite);
        if (urgencia === 'normal') return; // No genera alerta

        const dias = alertasService.diasRestantes(tarea.fechaLimite);
        const texto = alertasService.textoUrgencia(dias);

        alertas.push({
          id: `alerta-${tarea.id}`,
          tipo: urgencia, // 'vencida' | 'proxima'
          titulo: tarea.titulo,
          institucion: tarea.institucionNombre || 'Sin asignar',
          zona: tarea.zona || '',
          fechaLimite: tarea.fechaLimite,
          diasRestantes: dias,
          textoUrgencia: texto,
          tareaId: tarea.id,
          lineaAccionId: tarea.lineaAccionId,
          categoria: 'Vencimiento'
        });
      });

      // Ordenar: vencidas primero, luego por días restantes
      alertas.sort((a, b) => a.diasRestantes - b.diasRestantes);

      return alertas;
    } catch (error) {
      console.error('Error generando alertas de vencimiento:', error);
      return [];
    }
  }
};
