const BASE_URL = 'http://localhost:5000';

/**
 * Servicio exclusivo para el Dashboard Municipal.
 * Filtra TODOS los datos de seguridad/delitos antes de devolver resultados.
 */
export const muniService = {

  getFullMuniDashboard: async () => {
    try {
      const [tareas, reportes, lineas, usuarios] = await Promise.all([
        fetch(`${BASE_URL}/tareas`).then(r => r.json()),
        fetch(`${BASE_URL}/reportes`).then(r => r.json()),
        fetch(`${BASE_URL}/lineasAccion`).then(r => r.json()),
        fetch(`${BASE_URL}/usuarios`).then(r => r.json()),
      ]);

      // ─── FILTRO: Excluir tareas tipo 3 (operativos/seguridad) ───
      const tareasPreventivas = tareas.filter(t => t.tipo !== 3);
      // ─── FILTRO: Excluir reportes de tipo "Seguridad" ───
      const reportesFiltrados = reportes.filter(r => r.tipoActividad !== 'Seguridad');
      const reportesAprobados = reportesFiltrados.filter(r => r.estado === 'aprobado');

      const espaciosRecuperados = tareasPreventivas.filter(t => t.tipo === 2 && t.completada).length;
      const poblacionBeneficiada = reportesAprobados.reduce((sum, r) => sum + (r.beneficiados || 0), 0);
      const inversionSocial = reportesAprobados.reduce((sum, r) => sum + (r.inversionColones || 0), 0);
      const campanasActivas = tareasPreventivas.filter(t => t.tipo === 1 && !t.completada).length;
      const tareasCompletadas = tareasPreventivas.filter(t => t.completada).length;
      const totalTareas = tareasPreventivas.length;
      const progresoGeneral = totalTareas > 0 ? Math.round((tareasCompletadas / totalTareas) * 100) : 0;

      const gruposEtarios = { ninos: 0, jovenes: 0, adultos: 0, adultosMayores: 0 };
      reportesAprobados.forEach(r => {
        if (r.asistentes) {
          gruposEtarios.ninos += r.asistentes.ninos || 0;
          gruposEtarios.jovenes += r.asistentes.jovenes || 0;
          gruposEtarios.adultos += r.asistentes.adultos || 0;
          gruposEtarios.adultosMayores += r.asistentes.adultosMayores || 0;
        }
      });

      const lineasPreventivas = lineas.filter(l => {
        return tareasPreventivas.some(t => t.lineaAccionId === l.id);
      });

      const lineasConProgreso = lineasPreventivas.map(linea => {
        const tareasLinea = tareasPreventivas.filter(t => t.lineaAccionId === linea.id);
        const completadasLinea = tareasLinea.filter(t => t.completada).length;
        const progreso = tareasLinea.length > 0 ? Math.round((completadasLinea / tareasLinea.length) * 100) : 0;
        const inversion = tareasLinea.reduce((sum, t) => sum + (t.inversionColones || 0), 0);
        return { ...linea, totalTareas: tareasLinea.length, completadas: completadasLinea, progreso, inversion, tareas: tareasLinea };
      });

      const reportesRecientes = reportesFiltrados
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .slice(0, 8)
        .map(r => {
          const tarea = tareasPreventivas.find(t => t.id === r.tareaId);
          return { ...r, tarea: tarea ? { titulo: tarea.titulo, zona: tarea.zona, lineaNombre: tarea.lineaNombre } : null };
        });

      const hoy = new Date();
      const tareasUrgentes = tareasPreventivas
        .filter(t => !t.completada && t.fechaLimite)
        .map(t => ({ ...t, diasRestantes: Math.ceil((new Date(t.fechaLimite) - hoy) / (1000 * 60 * 60 * 24)) }))
        .filter(t => t.diasRestantes <= 30)
        .sort((a, b) => a.diasRestantes - b.diasRestantes);

      return {
        kpis: { espaciosRecuperados, poblacionBeneficiada, inversionSocial, campanasActivas, tareasCompletadas, totalTareas, progresoGeneral },
        gruposEtarios,
        lineasConProgreso,
        reportesRecientes,
        tareasPreventivas,
        tareasUrgentes,
      };
    } catch (error) {
      console.error('Error en muniService.getFullMuniDashboard:', error);
      return null;
    }
  },

  getTareasPreventivas: async () => {
    try {
      const [tareas, reportes] = await Promise.all([
        fetch(`${BASE_URL}/tareas`).then(r => r.json()),
        fetch(`${BASE_URL}/reportes`).then(r => r.json()),
      ]);
      return tareas.filter(t => t.tipo !== 3).map(t => {
        const misReportes = reportes.filter(r => r.tareaId === t.id && r.estado === 'aprobado');
        const avance = misReportes.reduce((sum, r) => sum + (r.beneficiados || 0), 0);
        return { ...t, avanceReal: avance, reportesAprobados: misReportes.length };
      });
    } catch (error) {
      console.error('Error en muniService.getTareasPreventivas:', error);
      return [];
    }
  },

  getReportesComunitarios: async () => {
    try {
      const [reportes, tareas] = await Promise.all([
        fetch(`${BASE_URL}/reportes`).then(r => r.json()),
        fetch(`${BASE_URL}/tareas`).then(r => r.json()),
      ]);
      return reportes
        .filter(r => r.tipoActividad !== 'Seguridad')
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .map(r => {
          const tarea = tareas.find(t => t.id === r.tareaId);
          return { ...r, tarea: tarea ? { titulo: tarea.titulo, zona: tarea.zona, lineaNombre: tarea.lineaNombre, lineaNumero: tarea.lineaNumero } : null };
        });
    } catch (error) {
      console.error('Error en muniService.getReportesComunitarios:', error);
      return [];
    }
  }
};
