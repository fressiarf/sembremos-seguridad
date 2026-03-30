const BASE_URL = 'http://localhost:5000';

export const editoresService = {
  /**
   * Obtiene las líneas de acción que tienen tareas asignadas a la institución
   */
  getLineasDeInstitucion: async (userId) => {
    try {
      const tareas = await editoresService.getTareasDeInstitucion(userId);
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
  getTareasDeInstitucion: async (userId, institucionId) => {
    try {
      const response = await fetch(`${BASE_URL}/tareas`);
      if (!response.ok) throw new Error('Error fetching tareas');
      const allTareas = await response.json();
      
      // Filtramos las tareas donde el usuario es responsable (individual o en grupo)
      // O si queremos ver todas las de la institución (opcional, pero el requerimiento pide "mis tareas")
      return allTareas.filter(t => 
        String(t.responsableId) === String(userId) || 
        (t.responsableIds && Array.isArray(t.responsableIds) && t.responsableIds.map(String).includes(String(userId)))
      );
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
  getEstadisticas: async (userId) => {
    try {
      const tareas = await editoresService.getTareasDeInstitucion(userId);
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
  getFullDashboardData: async (userId) => {
    try {
      const [tareas, reportesRes] = await Promise.all([
        editoresService.getTareasDeInstitucion(userId),
        fetch(`${BASE_URL}/reportes`)
      ]);
      const reportes = await reportesRes.json();

      // Enriquecer tareas con su progreso real (suma de reportes aprobados)
      const tareasConProgreso = tareas.map(tarea => {
        const reportesAprobados = reportes.filter(r => String(r.tareaId) === String(tarea.id) && r.estado === 'aprobado');
        
        let avanceAcumulado = 0;
        if (tarea.seguimientoTipo === 'hitos' || (tarea.tipo === 2 && !tarea.seguimientoTipo)) { // Seguimiento por Hitos
          avanceAcumulado = reportesAprobados.length > 0 ? Math.max(...reportesAprobados.map(r => {
             const hitosCompletados = r.hitos?.filter(h => h.completado).length || 0;
             const totalHitos = r.hitos?.length || 5;
             return Math.round((hitosCompletados / totalHitos) * 100);
          })) : 0;
        } else {
          avanceAcumulado = reportesAprobados.reduce((sum, r) => sum + (parseInt(r.beneficiados) || 0), 0);
        }

        const metaNum = parseInt(tarea.meta) || 1;
        const porcentaje = tarea.tipo === 2 ? avanceAcumulado : Math.min(Math.round((avanceAcumulado / metaNum) * 100), 100);

        return {
          ...tarea,
          avanceAcumulado,
          progresoReal: porcentaje,
          completada: porcentaje >= 100 || tarea.completada
        };
      });

      // Obtener las líneas relacionadas
      const lineaIds = [...new Set(tareasConProgreso.map(t => t.lineaAccionId))];
      const resLineas = await fetch(`${BASE_URL}/lineasAccion`);
      const allLineas = await resLineas.json();
      const lineas = allLineas.filter(l => lineaIds.includes(l.id));

      // Enriquecer líneas con sus tareas y progreso acumulado
      const lineasEnriquecidas = lineas.map(linea => {
        const tareasLinea = tareasConProgreso.filter(t => t.lineaAccionId === linea.id);
        const progresoTotal = tareasLinea.reduce((sum, t) => sum + (t.progresoReal || 0), 0);
        const completadasCount = tareasLinea.filter(t => t.completada).length;
        
        return {
          ...linea,
          tareas: tareasLinea,
          totalTareas: tareasLinea.length,
          tareasCompletadas: completadasCount,
          progreso: tareasLinea.length > 0 ? Math.round(progresoTotal / tareasLinea.length) : 0,
          inversionLinea: tareasLinea.reduce((sum, t) => sum + (t.inversionColones || 0), 0)
        };
      });

      // Stats consolidadas
      const totalInversion = tareasConProgreso.reduce((sum, t) => sum + (t.inversionColones || 0), 0);
      const totalProgreso = lineasEnriquecidas.length > 0 
        ? Math.round(lineasEnriquecidas.reduce((sum, l) => sum + l.progreso, 0) / lineasEnriquecidas.length) 
        : 0;

      const estadisticas = {
        totalTareas: tareasConProgreso.length,
        completadas: tareasConProgreso.filter(t => t.completada).length,
        pendientes: tareasConProgreso.filter(t => !t.completada).length,
        inversionTotal: totalInversion,
        progresoGeneral: totalProgreso
      };

      // Tareas enriquecidas para la lista
      const tareasEnriquecidas = tareasConProgreso.map(t => {
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
