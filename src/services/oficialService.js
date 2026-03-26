const BASE_URL = 'http://localhost:5000';

export const institucionService = {
  /**
   * Obtiene las líneas de acción que tienen tareas asignadas a la institución
   */
  getLineasDeInstitucion: async (institucionId) => {
    try {
      const tareas = await institucionService.getTareasDeInstitucion(institucionId);
      const lineaIds = [...new Set(tareas.map(t => t.lineaAccionId))];
      const resLineas = await fetch(`${BASE_URL}/lineasAccion`);
      const allLineas = await resLineas.json();
      return allLineas.filter(l => lineaIds.includes(l.id));
    } catch (error) {
      console.error('Error in getLineasDeInstitucion:', error);
      return [];
    }
  },

  /**
   * Obtiene TODAS las tareas asignadas a la institución
   */
  getTareasDeInstitucion: async (institucionId) => {
    try {
      const response = await fetch(`${BASE_URL}/tareas?institucionId=${institucionId}`);
      if (!response.ok) throw new Error('Error fetching tareas');
      return await response.json();
    } catch (error) {
      console.error('Error in getTareasDeInstitucion:', error);
      return [];
    }
  },

  /**
   * Obtiene tareas de una línea de acción específica para una institución
   */
  getTareasPorLinea: async (lineaAccionId, institucionId) => {
    try {
      let url = `${BASE_URL}/tareas?lineaAccionId=${lineaAccionId}`;
      if (institucionId) url += `&institucionId=${institucionId}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error fetching tareas por línea');
      return await response.json();
    } catch (error) {
      console.error('Error in getTareasPorLinea:', error);
      return [];
    }
  },

  /**
   * Marca una tarea como completada con reporte de la institución (Crea un Reporte real)
   */
  completarTarea: async (tareaId, reporteData) => {
    try {
      const response = await fetch(`${BASE_URL}/reportes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tareaId: tareaId,
          responsableId: reporteData.responsableId || null,
          estado: 'pendiente',
          fecha: new Date().toISOString().split('T')[0],
          
          descripcion: reporteData.reporteInstitucion || '',
          beneficiados: reporteData.totalAsistentes || 0,
          asistentes: reporteData.asistentes || {},
          
          tipoActividad: reporteData.tipoActividad || '',
          inversionColones: reporteData.inversionColones || 0,
          detalleRecursos: reporteData.detalleRecursos || '',
          
          fotos: reporteData.fotos || [],
          observaciones: reporteData.observaciones || '',
          
          // Nuevos campos dinámicos
          tipoTarea: reporteData.tipoTarea || 1,
          hitos: reporteData.hitos || [],
          incidencias: reporteData.incidencias || 0,
          numeroPatrullajes: reporteData.numeroPatrullajes || 0,
          acuerdos: reporteData.acuerdos || '',
          institucionesPresentes: reporteData.institucionesPresentes || '',
          itemsEntregados: reporteData.itemsEntregados || '',
          numeroSerie: reporteData.numeroSerie || '',

          accionEstrategica: typeof reporteData.accionEstrategica === 'string' ? reporteData.accionEstrategica : '',
          indicador: typeof reporteData.indicador === 'string' ? reporteData.indicador : ''
        })
      });
      if (!response.ok) throw new Error('Error creating reporte');
      return await response.json();
    } catch (error) {
      console.error('Error in completarTarea:', error);
      throw error;
    }
  },

  /**
   * Corrige un reporte previamente rechazado y lo vuelve a poner en pendiente
   */
  editarReporteRechazado: async (reporteId, reporteData) => {
    try {
      const response = await fetch(`${BASE_URL}/reportes/${reporteId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estado: 'pendiente',
          fecha: new Date().toISOString().split('T')[0],
          descripcion: reporteData.reporteInstitucion || '',
          beneficiados: reporteData.totalAsistentes || 0,
          asistentes: reporteData.asistentes || {},
          tipoActividad: reporteData.tipoActividad || '',
          inversionColones: reporteData.inversionColones || 0,
          detalleRecursos: reporteData.detalleRecursos || '',
          fotos: reporteData.fotos || [],
          observaciones: reporteData.observaciones || '',
          // Campos dinámicos para edición
          tipoTarea: reporteData.tipoTarea || 1,
          hitos: reporteData.hitos || [],
          incidencias: reporteData.incidencias || 0,
          numeroPatrullajes: reporteData.numeroPatrullajes || 0,
          acuerdos: reporteData.acuerdos || '',
          institucionesPresentes: reporteData.institucionesPresentes || '',
          itemsEntregados: reporteData.itemsEntregados || '',
          numeroSerie: reporteData.numeroSerie || '',
          observacionRechazo: '' // Resetea la observación del admin
        })
      });
      if (!response.ok) throw new Error('Error updating reporte');
      return await response.json();
    } catch (error) {
      console.error('Error in editarReporteRechazado:', error);
      throw error;
    }
  },

  /**
   * Calcula estadísticas de la institución
   */
  getEstadisticas: async (institucionId) => {
    try {
      const tareas = await institucionService.getTareasDeInstitucion(institucionId);
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
   * Obtiene todos los datos del dashboard de la institución
   */
  getFullDashboardData: async (institucionId) => {
    try {
      const [tareas, estadisticas] = await Promise.all([
        institucionService.getTareasDeInstitucion(institucionId),
        institucionService.getEstadisticas(institucionId)
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
      console.error('Error fetching full institucion dashboard data:', error);
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
