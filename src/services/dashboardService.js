const BASE_URL = 'http://localhost:5000';

export const dashboardService = {
  /**
   * Obtiene todas las líneas de acción
   */
  getLineasAccion: async () => {
    try {
      const response = await fetch(`${BASE_URL}/lineasAccion`);
      if (!response.ok) throw new Error('Error fetching líneas');
      return await response.json();
    } catch (error) {
      console.error('Error fetching líneas:', error);
      return [];
    }
  },

  /**
   * Obtiene todas las tareas
   */
  getTareas: async () => {
    try {
      const response = await fetch(`${BASE_URL}/tareas`);
      if (!response.ok) throw new Error('Error fetching tareas');
      return await response.json();
    } catch (error) {
      console.error('Error fetching tareas:', error);
      return [];
    }
  },

  /**
   * Obtiene TODOS los datos del dashboard global de una sola vez
   */
  getFullDashboardData: async () => {
    try {
      const [lineas, tareas, zonas, alertas, notificaciones] = await Promise.all([
        fetch(`${BASE_URL}/lineasAccion`).then(r => r.json()),
        fetch(`${BASE_URL}/tareas`).then(r => r.json()),
        fetch(`${BASE_URL}/zonas`).then(r => r.json()),
        fetch(`${BASE_URL}/alertas`).then(r => r.json()),
        fetch(`${BASE_URL}/notificaciones`).then(r => r.json())
      ]);

      // Enriquecer líneas con tareas y progreso
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

      // Stats globales
      const totalTareas = tareas.length;
      const tareasCompletadas = tareas.filter(t => t.completada).length;
      const inversionTotal = tareas.filter(t => t.completada).reduce((sum, t) => sum + (t.inversionColones || 0), 0);

      return {
        lineas: lineasEnriquecidas,
        tareas,
        activities: tareas,
        zones: zonas,
        alerts: alertas,
        notifications: notificaciones,
        stats: {
          totalLineas: lineas.length,
          totalTareas,
          tareasCompletadas,
          tareasPendientes: totalTareas - tareasCompletadas,
          inversionTotal,
          cumplimiento: totalTareas > 0 ? Math.round((tareasCompletadas / totalTareas) * 100) : 0
        }
      };
    } catch (error) {
      console.error('Error fetching full dashboard data:', error);
      return null;
    }
  },

  /**
   * Crea una nueva línea de acción (Admin)
   */
  createLineaAccion: async (lineaData) => {
    try {
      const response = await fetch(`${BASE_URL}/lineasAccion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lineaData)
      });
      if (!response.ok) throw new Error('Error creating línea de acción');
      return await response.json();
    } catch (error) {
      console.error('Error in createLineaAccion:', error);
      throw error;
    }
  },

  /**
   * Crea una nueva tarea bajo una línea de acción (Admin)
   */
  createTarea: async (tareaData) => {
    try {
      const response = await fetch(`${BASE_URL}/tareas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...tareaData,
          completada: false,
          fechaCompletada: null,
          reporteInstitucion: '',
          fotos: [],
          inversionColones: 0
        })
      });
      if (!response.ok) throw new Error('Error creating tarea');
      return await response.json();
    } catch (error) {
      console.error('Error in createTarea:', error);
      throw error;
    }
  },

  /**
   * Obtiene las zonas del programa
   */
  getZonas: async () => {
    try {
      const response = await fetch(`${BASE_URL}/zonas`);
      if (!response.ok) throw new Error('Error fetching zonas');
      return await response.json();
    } catch (error) {
      console.error('Error in getZonas:', error);
      throw error;
    }
  },

  /**
   * Envía un reporte de avance de una institución corresponsable
   */
  postReporte: async (reporteData) => {
    try {
      const response = await fetch(`${BASE_URL}/reportes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...reporteData,
          fechaCreacion: new Date().toISOString(),
          estado: 'pendiente'
        })
      });
      if (!response.ok) throw new Error('Error enviando reporte');
      return await response.json();
    } catch (error) {
      console.error('Error in postReporte:', error);
      throw error;
    }
  },
  
  /**
   * Obtiene estadísticas rápidas para el Sidebar
   */
  getStats: async () => {
    try {
      const [tareas, zonas, alertas] = await Promise.all([
        fetch(`${BASE_URL}/tareas`).then(r => r.json()),
        fetch(`${BASE_URL}/zonas`).then(r => r.json()),
        fetch(`${BASE_URL}/alertas`).then(r => r.json())
      ]);
      return {
        activitiesCount: tareas.length,
        zonesCount: zonas.length,
        alertsCount: alertas.length
      };
    } catch (error) {
      console.error('Error in getStats:', error);
      return { activitiesCount: 0, zonesCount: 0, alertsCount: 0 };
    }
  }
};
