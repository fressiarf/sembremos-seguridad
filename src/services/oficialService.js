const BASE_URL = 'http://localhost:5000';

export const oficialService = {
  getLineasAccion: async (oficialId) => {
    try {
      // Filtrar por oficialId en la petición al JSON server
      const response = await fetch(`${BASE_URL}/actividades?oficialId=${oficialId}`);
      if (!response.ok) throw new Error('Error fetching actividades');
      const actos = await response.json();
      
      // Map 'actividades' structure to 'lineas' structure expected by the UI
      return actos.map(act => ({
        id: act.id, // Necesario para actualizaciones
        codigo: act.lineaAccion || `LA-2024-${act.id.toString().padStart(2, '0')}`,
        titulo: act.titulo || act.problematica,
        problematica: act.problematica,
        lineaAccion: act.lineaAccion,
        propuestaMeta: act.propuestaMeta,
        responsables: act.responsables,
        zona: act.zona || "Asignada", 
        porcentaje: act.status === 'Completada' ? 100 : (act.status.toLowerCase().includes('ejecución') ? 50 : 0),
        estado: act.status,
        descripcion: act.descripcion,
        fecha: act.fecha
      }));
    } catch (error) {
      console.error('Error in getLineasAccion:', error);
      return [];
    }
  },

  getEstadisticas: async (oficialId) => {
    try {
      const response = await fetch(`${BASE_URL}/actividades?oficialId=${oficialId}`);
      if (!response.ok) throw new Error('Error fetching stats');
      const actividades = await response.json();
      
      const completadas = actividades.filter(a => a.status === 'Completada').length;
      const enProceso = actividades.filter(a => (a.status || '').toLowerCase().includes('ejecución')).length;
      const total = actividades.length;
      const progresoGeneral = total > 0 ? Math.round((completadas / total) * 100) : 0;

      return {
        misLineas: total,
        reportesListos: completadas,
        porReportar: enProceso,
        sinActividad: total - completadas - enProceso,
        progresoGeneral: progresoGeneral
      };
    } catch (error) {
      console.error('Error in getEstadisticas:', error);
      return {
        misLineas: 0,
        reportesListos: 0,
        porReportar: 0,
        sinActividad: 0,
        progresoGeneral: 0
      };
    }
  },

  getHitos: async (oficialId) => {
    try {
      const response = await fetch(`${BASE_URL}/alertas`);
      if (!response.ok) throw new Error('Error fetching hitos from alertas');
      const alertas = await response.json();
      
      // Mapping 'alertas' to upcoming 'hitos' format as placeholder 
      return alertas.map(al => ({
        titulo: al.descripcion,
        fecha: "Pendiente"
      }));
    } catch (error) {
      console.error('Error in getHitos:', error);
      return [];
    }
  },

  getFullDashboardData: async (oficialId) => {
    try {
      const [lineas, estadisticas, hitos] = await Promise.all([
        oficialService.getLineasAccion(oficialId),
        oficialService.getEstadisticas(oficialId),
        oficialService.getHitos(oficialId)
      ]);

      return { lineas, estadisticas, hitos };
    } catch (error) {
      console.error('Error fetching full oficial dashboard data:', error);
      return null;
    }
  },

  updateActividad: async (id, data) => {
    try {
      const response = await fetch(`${BASE_URL}/actividades/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Error updating activity');
      return await response.json();
    } catch (error) {
      console.error('Error in updateActividad:', error);
      throw error;
    }
  }
};
