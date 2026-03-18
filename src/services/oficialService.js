const BASE_URL = 'http://localhost:3001';

export const oficialService = {
  /**
   * Obtiene las líneas de acción que tienen tareas asignadas al oficial
   */
  getLineasDelOficial: async (oficialId) => {
    try {
      // Primero traemos las tareas del oficial
      const tareas = await oficialService.getTareasDelOficial(oficialId);
      // Obtenemos IDs únicos de líneas
      const lineaIds = [...new Set(tareas.map(t => t.lineaAccionId))];
      // Traemos todas las líneas
      const resLineas = await fetch(`${BASE_URL}/lineasAccion`);
      const allLineas = await resLineas.json();
      // Filtramos solo las que le corresponden
      return allLineas.filter(l => lineaIds.includes(l.id));
    } catch (error) {
      console.error('Error in getLineasDelOficial:', error);
      return [];
    }
  },

  /**
   * Obtiene TODAS las tareas asignadas al oficial
   */
  getTareasDelOficial: async (oficialId) => {
    try {
      const response = await fetch(`${BASE_URL}/tareas?oficialId=${oficialId}`);
      if (!response.ok) throw new Error('Error fetching tareas');
      return await response.json();
    } catch (error) {
      console.error('Error in getTareasDelOficial:', error);
      return [];
    }
  },

  /**
   * Obtiene tareas de una línea de acción específica para un oficial
   */
  getTareasPorLinea: async (lineaAccionId, oficialId) => {
    try {
      let url = `${BASE_URL}/tareas?lineaAccionId=${lineaAccionId}`;
      if (oficialId) url += `&oficialId=${oficialId}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error fetching tareas por línea');
      return await response.json();
    } catch (error) {
      console.error('Error in getTareasPorLinea:', error);
      return [];
    }
  },

  /**
   * Marca una tarea como completada con reporte del oficial
   */
  completarTarea: async (tareaId, reporteData) => {
    try {
      const response = await fetch(`${BASE_URL}/tareas/${tareaId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completada: true,
          fechaCompletada: new Date().toISOString().split('T')[0],
          reporteOficial: reporteData.reporteOficial || '',
          fotos: reporteData.fotos || [],
          inversionColones: reporteData.inversionColones || 0
        })
      });
      if (!response.ok) throw new Error('Error completing tarea');
      return await response.json();
    } catch (error) {
      console.error('Error in completarTarea:', error);
      throw error;
    }
  },

  /**
   * Calcula estadísticas del oficial
   */
  getEstadisticas: async (oficialId) => {
    try {
      const tareas = await oficialService.getTareasDelOficial(oficialId);
      const completadas = tareas.filter(t => t.completada);
      const pendientes = tareas.filter(t => !t.completada);
      const inversionTotal = completadas.reduce((sum, t) => sum + (t.inversionColones || 0), 0);
      const progresoGeneral = tareas.length > 0 ? Math.round((completadas.length / tareas.length) * 100) : 0;

      return {
        totalTareas: tareas.length,
        completadas: completadas.length,
        pendientes: pendientes.length,
        inversionTotal,
        progresoGeneral
      };
    } catch (error) {
      console.error('Error in getEstadisticas:', error);
      return { totalTareas: 0, completadas: 0, pendientes: 0, inversionTotal: 0, progresoGeneral: 0 };
    }
  },

  /**
   * Obtiene todos los datos del dashboard del oficial
   */
  getFullDashboardData: async (oficialId) => {
    try {
      const [tareas, estadisticas] = await Promise.all([
        oficialService.getTareasDelOficial(oficialId),
        oficialService.getEstadisticas(oficialId)
      ]);

      // Obtener las líneas relacionadas
      const lineaIds = [...new Set(tareas.map(t => t.lineaAccionId))];
      const resLineas = await fetch(`${BASE_URL}/lineasAccion`);
      const allLineas = await resLineas.json();
      const lineas = allLineas.filter(l => lineaIds.includes(l.id));

      // Enriquecer líneas con sus tareas y progreso
      const lineasEnriquecidas = lineas.map(linea => {
        const tareasLinea = tareas.filter(t => t.lineaAccionId === linea.id);
        const completadas = tareasLinea.filter(t => t.completada);
        return {
          ...linea,
          tareas: tareasLinea,
          totalTareas: tareasLinea.length,
          tareasCompletadas: completadas.length,
          progreso: tareasLinea.length > 0 ? Math.round((completadas.length / tareasLinea.length) * 100) : 0,
          inversionLinea: completadas.reduce((sum, t) => sum + (t.inversionColones || 0), 0)
        };
      });

      // Enriquecer tareas con el nombre de su línea
      const tareasEnriquecidas = tareas.map(t => {
        const linea = lineas.find(l => l.id === t.lineaAccionId);
        return {
          ...t,
          lineaNombre: linea ? linea.lineaAccion : 'Línea Desconocida',
          problematica: linea ? linea.problematica : ''
        };
      });

      return { lineas: lineasEnriquecidas, tareas: tareasEnriquecidas, estadisticas };
    } catch (error) {
      console.error('Error fetching full oficial dashboard data:', error);
      return null;
    }
  },

  /**
   * Obtiene hitos/alertas del sistema
   */
  getHitos: async () => {
    try {
      const response = await fetch(`${BASE_URL}/alertas`);
      if (!response.ok) return [];
      const alertas = await response.json();
      return alertas.map(al => ({ titulo: al.descripcion, fecha: al.tipo }));
    } catch (error) {
      return [];
    }
  }
};
