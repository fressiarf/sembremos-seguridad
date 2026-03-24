/**
 * Mock Data Service — Admin Institución
 * Datos reales del programa Sembremos Seguridad, D-71 Puntarenas 2025–2026
 * 
 * Este servicio simula llamadas a API.
 * Para conectar a backend real, reemplazar las funciones internas por fetch().
 */

// ── Responsables (funcionarios municipales de Puntarenas) ──
const RESPONSABLES = [
  { id: 'r1', nombre: 'Andrea Villalobos Mora', cargo: 'Coordinadora de Programas Sociales', institucion: 'Municipalidad de Puntarenas' },
  { id: 'r2', nombre: 'Carlos Ramírez Solís', cargo: 'Encargado de Espacios Públicos', institucion: 'Municipalidad de Puntarenas' },
  { id: 'r3', nombre: 'María Fernanda Castillo', cargo: 'Comunicadora Social', institucion: 'Municipalidad de Puntarenas' },
  { id: 'r4', nombre: 'José Alberto Núñez', cargo: 'Promotor Comunitario', institucion: 'Municipalidad de Puntarenas' },
  { id: 'r5', nombre: 'Daniela Porras Chacón', cargo: 'Trabajadora Social', institucion: 'Municipalidad de Puntarenas' },
  { id: 'r6', nombre: 'Luis Diego Araya', cargo: 'Coordinador Juvenil', institucion: 'Municipalidad de Puntarenas' },
];

// ── Líneas de acción reales asignadas a Municipalidad ──
const LINEAS_ACCION = [
  {
    id: 'linea-1',
    numero: 1,
    nombre: 'Consumo de drogas',
    lider: 'Municipalidad',
    coGestores: ['IAFA', 'MEP', 'PANI', 'Bomberos', 'Ministerio de Salud', 'IMAS', 'Cruz Roja'],
  },
  {
    id: 'linea-3',
    numero: 3,
    nombre: 'Personas en situación de calle',
    lider: 'Municipalidad',
    coGestores: ['Red de personas en situación de calle'],
  },
  {
    id: 'linea-4',
    numero: 4,
    nombre: 'Falta de inversión social',
    lider: 'Municipalidad',
    coGestores: ['Red de personas joven', 'PANI', 'Actores Civiles'],
  },
];

// ── Tareas mock con datos reales de acciones estratégicas ──
const TAREAS = [
  // ─── Línea #1: Consumo de drogas ───
  {
    id: 't1',
    lineaId: 'linea-1',
    lineaNumero: 1,
    lineaNombre: 'Consumo de drogas',
    titulo: 'Apoyar programas educativos y preventivos',
    descripcion: 'Coordinar con MEP e IAFA para implementar programas de prevención en centros educativos de Puntarenas.',
    indicador: 'Programas ejecutados',
    meta: '6 programas cuatrimestrales',
    frecuencia: 'Cuatrimestral',
    trimestre: 'I Trimestre 2025',
    estado: 'Con Actividades',
    responsableId: 'r1',
    fechaLimite: '2025-04-30',
    zona: 'Barranca',
    prioridad: 'alta',
  },
  {
    id: 't2',
    lineaId: 'linea-1',
    lineaNumero: 1,
    lineaNombre: 'Consumo de drogas',
    titulo: 'Desarrollar y mejorar espacios públicos recreativos',
    descripcion: 'Identificar y habilitar espacios públicos para actividades recreativas comunitarias.',
    indicador: 'Espacios habilitados',
    meta: '8 espacios trimestrales',
    frecuencia: 'Trimestral',
    trimestre: 'I Trimestre 2025',
    estado: 'Sin Actividades',
    responsableId: 'r2',
    fechaLimite: '2025-03-31',
    zona: 'Chacarita',
    prioridad: 'alta',
  },
  {
    id: 't3',
    lineaId: 'linea-1',
    lineaNumero: 1,
    lineaNombre: 'Consumo de drogas',
    titulo: 'Lanzar campañas de concientización en medios locales y redes',
    descripcion: 'Diseñar y ejecutar campañas en redes sociales y medios locales sobre prevención del consumo.',
    indicador: 'Campañas lanzadas',
    meta: '12 campañas bimensuales',
    frecuencia: 'Bimensual',
    trimestre: 'II Trimestre 2025',
    estado: 'Con Actividades',
    responsableId: 'r3',
    fechaLimite: '2025-06-30',
    zona: 'Puntarenas',
    prioridad: 'media',
  },
  {
    id: 't4',
    lineaId: 'linea-1',
    lineaNumero: 1,
    lineaNombre: 'Consumo de drogas',
    titulo: 'Apoyar programas de orientación para familias con adicción',
    descripcion: 'Brindar acompañamiento y orientación a núcleos familiares afectados por la adicción.',
    indicador: 'Familias atendidas',
    meta: '3 familias',
    frecuencia: 'Continuo',
    trimestre: 'I Trimestre 2025',
    estado: 'Completado',
    responsableId: 'r5',
    fechaLimite: '2025-03-31',
    zona: 'El Roble',
    prioridad: 'alta',
  },
  {
    id: 't5',
    lineaId: 'linea-1',
    lineaNumero: 1,
    lineaNombre: 'Consumo de drogas',
    titulo: 'Capacitar y dar seguimiento a red de Jóvenes Voluntarios',
    descripcion: 'Formar jóvenes voluntarios como agentes de cambio comunitario y dar seguimiento.',
    indicador: 'Seguimientos realizados',
    meta: '2 seguimientos semestrales',
    frecuencia: 'Semestral',
    trimestre: 'II Trimestre 2025',
    estado: 'Sin Actividades',
    responsableId: 'r6',
    fechaLimite: '2025-06-30',
    zona: 'Barranca',
    prioridad: 'media',
  },

  // ─── Línea #3: Personas en situación de calle ───
  {
    id: 't6',
    lineaId: 'linea-3',
    lineaNumero: 3,
    lineaNombre: 'Personas en situación de calle',
    titulo: 'Analizar y dar seguimiento a herramienta digital en Mesas de Articulación Local',
    descripcion: 'Implementar y monitorear herramienta digital para la coordinación interinstitucional.',
    indicador: 'Seguimientos realizados',
    meta: '8 seguimientos trimestrales',
    frecuencia: 'Trimestral',
    trimestre: 'I Trimestre 2025',
    estado: 'Con Actividades',
    responsableId: 'r4',
    fechaLimite: '2025-03-31',
    zona: 'Puntarenas',
    prioridad: 'alta',
  },
  {
    id: 't7',
    lineaId: 'linea-3',
    lineaNumero: 3,
    lineaNombre: 'Personas en situación de calle',
    titulo: 'Ejecutar campañas de reducción del daño para adicciones y salud mental',
    descripcion: 'Desarrollar campañas enfocadas en reducir el impacto de adicciones en personas en calle.',
    indicador: 'Campañas ejecutadas',
    meta: '4 campañas semestrales',
    frecuencia: 'Semestral',
    trimestre: 'II Trimestre 2025',
    estado: 'Sin Actividades',
    responsableId: 'r5',
    fechaLimite: '2025-06-30',
    zona: 'Chacarita',
    prioridad: 'media',
  },

  // ─── Línea #4: Falta de inversión social ───
  {
    id: 't8',
    lineaId: 'linea-4',
    lineaNumero: 4,
    lineaNombre: 'Falta de inversión social',
    titulo: 'Transformación de espacios públicos en áreas deportivas juveniles',
    descripcion: 'Construir o habilitar el Centro Cívico por la Paz como espacio deportivo juvenil.',
    indicador: 'Espacios transformados',
    meta: '1 por año — Centro Cívico por la Paz',
    frecuencia: 'Anual',
    trimestre: 'III Trimestre 2025',
    estado: 'Sin Actividades',
    responsableId: 'r2',
    fechaLimite: '2025-09-30',
    zona: 'Barranca',
    prioridad: 'alta',
  },
  {
    id: 't9',
    lineaId: 'linea-4',
    lineaNumero: 4,
    lineaNombre: 'Falta de inversión social',
    titulo: 'Creación de zonas de encuentro juvenil',
    descripcion: 'Diseñar y habilitar espacios seguros de encuentro para la población joven.',
    indicador: 'Zonas creadas',
    meta: '1 por año',
    frecuencia: 'Anual',
    trimestre: 'III Trimestre 2025',
    estado: 'Sin Actividades',
    responsableId: 'r6',
    fechaLimite: '2025-09-30',
    zona: 'El Roble',
    prioridad: 'media',
  },
  {
    id: 't10',
    lineaId: 'linea-4',
    lineaNumero: 4,
    lineaNombre: 'Falta de inversión social',
    titulo: 'Organización de festivales juveniles',
    descripcion: 'Planificar y ejecutar festivales culturales y deportivos para jóvenes de la comunidad.',
    indicador: 'Festivales organizados',
    meta: '2 festivales por año',
    frecuencia: 'Semestral',
    trimestre: 'II Trimestre 2025',
    estado: 'Con Actividades',
    responsableId: 'r6',
    fechaLimite: '2025-06-30',
    zona: 'Puntarenas',
    prioridad: 'media',
  },
  {
    id: 't11',
    lineaId: 'linea-4',
    lineaNumero: 4,
    lineaNombre: 'Falta de inversión social',
    titulo: 'Programas de voluntariado juvenil para recuperación de espacios públicos',
    descripcion: 'Coordinar grupos de voluntarios juveniles para la limpieza y embellecimiento de espacios.',
    indicador: 'Programas activos',
    meta: 'Continuo',
    frecuencia: 'Continuo',
    trimestre: 'I Trimestre 2025',
    estado: 'Completado',
    responsableId: 'r4',
    fechaLimite: '2025-03-31',
    zona: 'Fray Casiano',
    prioridad: 'baja',
  },
  {
    id: 't12',
    lineaId: 'linea-4',
    lineaNumero: 4,
    lineaNombre: 'Falta de inversión social',
    titulo: 'Ferias de emprendimiento juvenil',
    descripcion: 'Promover ferias donde jóvenes puedan exponer sus emprendimientos y recibir apoyo.',
    indicador: 'Ferias realizadas',
    meta: '2 por año',
    frecuencia: 'Semestral',
    trimestre: 'IV Trimestre 2025',
    estado: 'Sin Actividades',
    responsableId: null,
    fechaLimite: '2025-12-15',
    zona: 'El Carmen',
    prioridad: 'media',
  },
];

// ── Reportes mock ──
const REPORTES = [
  {
    id: 'rep1',
    tareaId: 't1',
    responsableId: 'r1',
    estado: 'pendiente', // pendiente | aprobado | rechazado
    fecha: '2025-03-15',
    descripcion: 'Se coordinó con el MEP la primera ronda de charlas preventivas en la Escuela de Barranca. Participaron 120 estudiantes y 8 docentes.',
    beneficiados: 120,
    fotos: ['charla_barranca_01.jpg', 'charla_barranca_02.jpg'],
    accionEstrategica: 'Apoyar programas educativos y preventivos',
    indicador: 'Programas ejecutados',
    observacionRechazo: null,
  },
  {
    id: 'rep2',
    tareaId: 't3',
    responsableId: 'r3',
    estado: 'pendiente',
    fecha: '2025-03-20',
    descripcion: 'Se lanzó la campaña "Puntarenas Libre de Drogas" en redes sociales con alcance de 5,400 personas. Se distribuyeron 200 volantes físicos en El Roble.',
    beneficiados: 5400,
    fotos: ['campana_redes_01.jpg'],
    accionEstrategica: 'Lanzar campañas de concientización en medios locales y redes',
    indicador: 'Campañas lanzadas',
    observacionRechazo: null,
  },
  {
    id: 'rep3',
    tareaId: 't6',
    responsableId: 'r4',
    estado: 'pendiente',
    fecha: '2025-03-18',
    descripcion: 'Se realizó la primera Mesa de Articulación Local con participación de 12 instituciones. Se validó la herramienta digital de seguimiento.',
    beneficiados: 35,
    fotos: ['mesa_articulacion_01.jpg', 'mesa_articulacion_02.jpg', 'mesa_articulacion_03.jpg'],
    accionEstrategica: 'Analizar y dar seguimiento a herramienta digital en Mesas de Articulación Local',
    indicador: 'Seguimientos realizados',
    observacionRechazo: null,
  },
  {
    id: 'rep4',
    tareaId: 't4',
    responsableId: 'r5',
    estado: 'aprobado',
    fecha: '2025-02-28',
    descripcion: 'Se completó el acompañamiento a 3 familias del sector de El Roble. Se brindó orientación en conjunto con el IAFA y seguimiento psicosocial.',
    beneficiados: 12,
    fotos: ['familias_orientacion.jpg'],
    accionEstrategica: 'Apoyar programas de orientación para familias con adicción',
    indicador: 'Familias atendidas',
    observacionRechazo: null,
  },
  {
    id: 'rep5',
    tareaId: 't10',
    responsableId: 'r6',
    estado: 'aprobado',
    fecha: '2025-03-10',
    descripcion: 'Se organizó el Festival Juvenil "Puntarenas Vive" con asistencia de 280 jóvenes. Actividades deportivas, artísticas y de emprendimiento.',
    beneficiados: 280,
    fotos: ['festival_01.jpg', 'festival_02.jpg'],
    accionEstrategica: 'Organización de festivales juveniles',
    indicador: 'Festivales organizados',
    observacionRechazo: null,
  },
  {
    id: 'rep6',
    tareaId: 't11',
    responsableId: 'r4',
    estado: 'aprobado',
    fecha: '2025-03-05',
    descripcion: 'Jornada de voluntariado en Fray Casiano con 45 jóvenes. Se recuperaron 2 parques y 1 cancha multiuso.',
    beneficiados: 45,
    fotos: ['voluntariado_fray_casiano.jpg'],
    accionEstrategica: 'Programas de voluntariado juvenil para recuperación de espacios públicos',
    indicador: 'Programas activos',
    observacionRechazo: null,
  },
  {
    id: 'rep7',
    tareaId: 't1',
    responsableId: 'r1',
    estado: 'rechazado',
    fecha: '2025-02-15',
    descripcion: 'Se realizó charla preventiva en Chacarita.',
    beneficiados: 30,
    fotos: [],
    accionEstrategica: 'Apoyar programas educativos y preventivos',
    indicador: 'Programas ejecutados',
    observacionRechazo: 'El reporte carece de detalle suficiente. Favor incluir: nombre del centro educativo, lista de asistencia, y al menos 2 fotos de evidencia.',
  },
];

// ── Helpers internos ──
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const getResponsable = (id) => RESPONSABLES.find(r => r.id === id) || null;

// ══════════════════════════════════════════════════════════════
//  SERVICE EXPORT
// ══════════════════════════════════════════════════════════════
export const adminInstitucionService = {

  getResponsables: async () => {
    await delay(100);
    return [...RESPONSABLES];
  },

  getLineasAccion: async () => {
    await delay(100);
    return [...LINEAS_ACCION];
  },

  /**
   * Dashboard: estadísticas generales de la institución
   */
  getDashboardData: async (institucion) => {
    await delay(200);
    const totalTareas = TAREAS.length;
    const completadas = TAREAS.filter(t => t.estado === 'Completado').length;
    const conActividades = TAREAS.filter(t => t.estado === 'Con Actividades').length;
    const sinActividades = TAREAS.filter(t => t.estado === 'Sin Actividades').length;
    const reportesPendientes = REPORTES.filter(r => r.estado === 'pendiente').length;
    const progreso = totalTareas > 0 ? Math.round((completadas / totalTareas) * 100) : 0;

    // Tareas urgentes: próximas a vencer o sin actividades con prioridad alta
    const hoy = new Date();
    const urgentes = TAREAS
      .filter(t => t.estado !== 'Completado')
      .filter(t => {
        const limite = new Date(t.fechaLimite);
        const diasRestantes = Math.ceil((limite - hoy) / (1000 * 60 * 60 * 24));
        return diasRestantes <= 30 || t.prioridad === 'alta';
      })
      .map(t => ({
        ...t,
        responsable: getResponsable(t.responsableId),
        diasRestantes: Math.ceil((new Date(t.fechaLimite) - hoy) / (1000 * 60 * 60 * 24)),
      }))
      .sort((a, b) => a.diasRestantes - b.diasRestantes)
      .slice(0, 5);

    // Reportes recientes esperando revisión
    const reportesRecientes = REPORTES
      .filter(r => r.estado === 'pendiente')
      .map(r => {
        const tarea = TAREAS.find(t => t.id === r.tareaId);
        return {
          ...r,
          tarea,
          responsable: getResponsable(r.responsableId),
        };
      })
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    return {
      estadisticas: {
        totalTareas,
        completadas,
        conActividades,
        sinActividades,
        reportesPendientes,
        progreso,
      },
      urgentes,
      reportesRecientes,
    };
  },

  /**
   * Gestión de tareas: lista completa con filtros
   */
  getTareas: async (filtros = {}) => {
    await delay(150);
    let resultado = TAREAS.map(t => {
      const ids = t.responsableIds || (t.responsableId ? [t.responsableId] : []);
      return {
        ...t,
        responsableIds: ids,
        responsables: ids.map(getResponsable),
        responsable: getResponsable(t.responsableId),
        linea: LINEAS_ACCION.find(l => l.id === t.lineaId) || { id: t.lineaId, numero: t.lineaNumero, nombre: t.lineaNombre },
      };
    });

    if (filtros.estado && filtros.estado !== 'Todos') {
      resultado = resultado.filter(t => t.estado === filtros.estado);
    }
    if (filtros.lineaId) {
      resultado = resultado.filter(t => t.lineaId === filtros.lineaId);
    }
    if (filtros.trimestre && filtros.trimestre !== 'Todos') {
      resultado = resultado.filter(t => t.trimestre === filtros.trimestre);
    }
    if (filtros.busqueda) {
      const q = filtros.busqueda.toLowerCase();
      resultado = resultado.filter(t =>
        t.titulo.toLowerCase().includes(q) ||
        t.descripcion.toLowerCase().includes(q) ||
        t.lineaNombre.toLowerCase().includes(q)
      );
    }

    return resultado;
  },

  /**
   * Asignar o reasignar responsable a una tarea
   */
  asignarResponsable: async (tareaId, responsableIds) => {
    await delay(200);
    const tarea = TAREAS.find(t => t.id === tareaId);
    if (tarea) {
      tarea.responsableIds = Array.isArray(responsableIds) ? responsableIds : (responsableIds ? [responsableIds] : []);
      tarea.responsableId = tarea.responsableIds[0] || null;
      return { success: true, tarea: { ...tarea, responsableIds: tarea.responsableIds, responsables: tarea.responsableIds.map(getResponsable) } };
    }
    return { success: false, error: 'Tarea no encontrada' };
  },

  /**
   * Reportes pendientes de revisión
   */
  getReportesPendientes: async () => {
    await delay(150);
    return REPORTES
      .filter(r => r.estado === 'pendiente')
      .map(r => {
        const tarea = TAREAS.find(t => t.id === r.tareaId);
        return {
          ...r,
          tarea,
          responsable: getResponsable(r.responsableId),
        };
      });
  },

  /**
   * Aprobar un reporte
   */
  aprobarReporte: async (reporteId) => {
    await delay(300);
    const reporte = REPORTES.find(r => r.id === reporteId);
    if (reporte) {
      reporte.estado = 'aprobado';
      reporte.observacionRechazo = null;
      return { success: true, reporte: { ...reporte } };
    }
    return { success: false };
  },

  /**
   * Editar un reporte antes de aprobarlo
   */
  editarReporte: async (reporteId, nuevosDatos) => {
    await delay(300);
    const reporte = REPORTES.find(r => r.id === reporteId);
    if (reporte) {
      reporte.descripcion = nuevosDatos.descripcion || reporte.descripcion;
      reporte.beneficiados = nuevosDatos.beneficiados !== undefined ? nuevosDatos.beneficiados : reporte.beneficiados;
      reporte.editadoPorAdmin = true;
      return { success: true, reporte: { ...reporte } };
    }
    return { success: false, error: 'Reporte no encontrado' };
  },

  /**
   * Rechazar un reporte con observación obligatoria
   */
  rechazarReporte: async (reporteId, observacion) => {
    await delay(300);
    const reporte = REPORTES.find(r => r.id === reporteId);
    if (reporte && observacion) {
      reporte.estado = 'rechazado';
      reporte.observacionRechazo = observacion;
      return { success: true, reporte: { ...reporte } };
    }
    return { success: false, error: 'Observación requerida' };
  },

  /**
   * Historial completo de reportes con filtros
   */
  getHistorial: async (filtros = {}) => {
    await delay(150);
    let resultado = REPORTES.map(r => {
      const tarea = TAREAS.find(t => t.id === r.tareaId);
      return {
        ...r,
        tarea,
        responsable: getResponsable(r.responsableId),
      };
    });

    if (filtros.estado && filtros.estado !== 'Todos') {
      resultado = resultado.filter(r => r.estado === filtros.estado);
    }
    if (filtros.responsableId && filtros.responsableId !== 'Todos') {
      resultado = resultado.filter(r => r.responsableId === filtros.responsableId);
    }
    if (filtros.lineaId && filtros.lineaId !== 'Todos') {
      resultado = resultado.filter(r => r.tarea?.lineaId === filtros.lineaId);
    }
    if (filtros.trimestre && filtros.trimestre !== 'Todos') {
      resultado = resultado.filter(r => r.tarea?.trimestre === filtros.trimestre);
    }

    return resultado.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  },

  /**
   * Tareas con fechas para el calendario
   */
  getCalendarioTareas: async () => {
    await delay(100);
    return TAREAS.map(t => ({
      id: t.id,
      titulo: t.titulo,
      fecha: t.fechaLimite,
      estado: t.estado,
      lineaNombre: t.lineaNombre,
      lineaNumero: t.lineaNumero,
      zona: t.zona,
      responsable: getResponsable(t.responsableId),
      prioridad: t.prioridad,
    }));
  },
};
