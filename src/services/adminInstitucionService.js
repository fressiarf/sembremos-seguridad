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
    asistentes: { ninos: 20, adolescentes: 80, jovenes: 20, adultos: 0, adultoMayor: 0 },
    tipoActividad: 'Charla',
    inversionColones: 125000,
    detalleRecursos: 'Refrigerios, material didáctico preventivo',
    observaciones: 'Excelente disposición del cuerpo docente.',
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
    asistentes: { ninos: 0, adolescentes: 1500, jovenes: 2000, adultos: 1500, adultoMayor: 400 },
    tipoActividad: 'Campaña',
    inversionColones: 350000,
    detalleRecursos: 'Pauta en redes, diseño gráfico e impresión de volantes',
    observaciones: 'Alto nivel de compartidos en Facebook.',
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
    asistentes: { ninos: 0, adolescentes: 0, jovenes: 10, adultos: 25, adultoMayor: 0 },
    tipoActividad: 'Mesa de Articulación',
    inversionColones: 45000,
    detalleRecursos: 'Alquiler de equipo de sonido, café',
    observaciones: 'Faltó presencia del PANI.',
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

  getResponsables: async (institucionNombre) => {
    try {
      const res = await fetch('http://localhost:5000/usuarios');
      const usuarios = await res.json();
      
      // Si no hay filtro, devolvemos los mock por compatibilidad (aunque lo ideal es filtrar)
      if (!institucionNombre) return [...RESPONSABLES];
      
      // Filtrar por rol 'institucion' (oficiales) y que coincida la institución
      return usuarios.filter(u => 
        (u.rol === 'institucion' || u.rol === 'editor') && 
        u.institucion === institucionNombre
      );
    } catch (e) {
      console.error("Error fetching responsables:", e);
      return [];
    }
  },

  getLineasAccion: async () => {
    try {
      const response = await fetch('http://localhost:5000/lineasAccion');
      if (!response.ok) throw new Error('Error fetching líneas');
      return await response.json();
    } catch (error) {
      console.error('Error fetching líneas:', error);
      return [];
    }
  },

  getDashboardData: async (institucionId) => {
    try {
      const [tareasReq, reportesReq] = await Promise.all([
        fetch('http://localhost:5000/tareas'),
        fetch('http://localhost:5000/reportes')
      ]);
      const allTareas = await tareasReq.json();
      const reportes = await reportesReq.json();
      const tareas = allTareas.filter(t => {
        if (t.institucionesIds && Array.isArray(t.institucionesIds)) {
          return t.institucionesIds.includes(String(institucionId));
        }
        return String(t.institucionId) === String(institucionId);
      });

      // Calcular progreso real por tarea basado en reportes aprobados
      let progresoTotalAcumulado = 0;
      let inversionTotal = 0;

      const tareasEnriquecidas = tareas.map(tarea => {
        const reportesAprobados = reportes.filter(r => String(r.tareaId) === String(tarea.id) && r.estado === 'aprobado');
        
        // Sumamos beneficiados (o avance % para tipo 2)
        let avance = 0;
        if (tarea.seguimientoTipo === 'hitos' || (tarea.tipo === 2 && !tarea.seguimientoTipo)) {
          avance = reportesAprobados.length > 0 ? Math.max(...reportesAprobados.map(r => {
            const hitosCompletados = r.hitos?.filter(h => h.completado).length || 0;
            const totalHitos = r.hitos?.length || 5;
            return Math.round((hitosCompletados / totalHitos) * 100);
          })) : 0;
        } else {
          avance = reportesAprobados.reduce((sum, r) => sum + (parseInt(r.beneficiados) || 0), 0);
        }

        const metaNum = parseInt(tarea.meta) || 1;
        const porcentaje = tarea.tipo === 2 ? avance : Math.min(Math.round((avance / metaNum) * 100), 100);
        
        progresoTotalAcumulado += porcentaje;
        inversionTotal += reportesAprobados.reduce((sum, r) => sum + (r.inversionColones || 0), 0);

        return { ...tarea, progresoReal: porcentaje, isCompletada: porcentaje >= 100 };
      });

      const totalTareas = tareas.length;
      const completadas = tareasEnriquecidas.filter(t => t.isCompletada).length;
      const conActividades = tareasEnriquecidas.filter(t => t.progresoReal > 0 && t.progresoReal < 100).length;
      const sinActividades = tareasEnriquecidas.filter(t => t.progresoReal === 0).length;
      
      const reportesInstitucion = reportes.filter(r => 
        tareas.some(t => String(t.id) === String(r.tareaId))
      );
      const reportesPendientes = reportesInstitucion.filter(r => r.estado === 'pendiente').length;
      const progreso = totalTareas > 0 ? Math.round(progresoTotalAcumulado / totalTareas) : 0;

      const hoy = new Date();
      const urgentes = tareas
        .filter(t => !tareasEnriquecidas.find(te => te.id === t.id)?.isCompletada)
        .map(t => {
          const dRestantes = t.fechaLimite ? Math.ceil((new Date(t.fechaLimite) - hoy) / (1000 * 60 * 60 * 24)) : NaN;
          return {
            ...t,
            diasRestantes: dRestantes,
            prioridad: t.prioridad || 'media'
          };
        })
        .filter(t => isNaN(t.diasRestantes) || t.diasRestantes <= 30 || t.prioridad === 'alta')
        .sort((a, b) => a.diasRestantes - b.diasRestantes)
        .slice(0, 5);

      const reportesRecientes = reportesInstitucion
        .filter(r => r.estado === 'pendiente')
        .map(r => ({ ...r, tarea: tareas.find(t => t.id === r.tareaId) }))
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

      return {
        estadisticas: { totalTareas, completadas, conActividades, sinActividades, reportesPendientes, progreso },
        urgentes,
        reportesRecientes,
      };
    } catch (e) {
      console.error(e);
      return { 
        estadisticas: { totalTareas: 0, completadas: 0, conActividades: 0, sinActividades: 0, reportesPendientes: 0, progreso: 0 }, 
        urgentes: [], reportesRecientes: [] 
      };
    }
  },

  getTareas: async (filtros = {}) => {
    try {
      const res = await fetch('http://localhost:5000/tareas');
      let tareas = await res.json();
      if (filtros.institucionId) {
        tareas = tareas.filter(t => {
          if (t.institucionesIds && Array.isArray(t.institucionesIds)) {
            return t.institucionesIds.includes(String(filtros.institucionId));
          }
          return String(t.institucionId) === String(filtros.institucionId);
        });
      }

      if (filtros.estado && filtros.estado !== 'Todos') {
        tareas = tareas.filter(t => t.estado === filtros.estado);
      }
      if (filtros.lineaId && filtros.lineaId !== 'Todos') {
        tareas = tareas.filter(t => t.lineaAccionId === filtros.lineaId);
      }
      if (filtros.trimestre && filtros.trimestre !== 'Todos') {
        tareas = tareas.filter(t => t.trimestre === filtros.trimestre);
      }
      if (filtros.busqueda) {
        const q = filtros.busqueda.toLowerCase();
        tareas = tareas.filter(t =>
          t.titulo?.toLowerCase().includes(q) || t.descripcion?.toLowerCase().includes(q)
        );
      }
      return tareas;
    } catch (e) {
      return [];
    }
  },

  asignarResponsable: async (tareaId, responsableIds) => {
    try {
      const response = await fetch(`http://localhost:5000/tareas/${tareaId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responsableIds })
      });
      return { success: response.ok };
    } catch (e) {
      return { success: false };
    }
  },

  getReportesPendientes: async (institucionId) => {
    try {
      const [resReq, tareasReq, usersReq] = await Promise.all([
        fetch('http://localhost:5000/reportes'),
        fetch('http://localhost:5000/tareas'),
        fetch('http://localhost:5000/usuarios')
      ]);
      const allReportes = await resReq.json();
      const reportes = allReportes.filter(r => r.estado === 'pendiente');
      const allTareas = await tareasReq.json();
      const tareas = allTareas.filter(t => {
        if (t.institucionesIds && Array.isArray(t.institucionesIds)) {
          return t.institucionesIds.includes(String(institucionId));
        }
        return String(t.institucionId) === String(institucionId);
      });
      const usuarios = await usersReq.json();
      
      const misReportes = reportes.filter(r => tareas.some(t => t.id === r.tareaId));
      return misReportes.map(r => ({
        ...r,
        tarea: tareas.find(t => t.id === r.tareaId),
        responsable: usuarios.find(u => String(u.id) === String(r.responsableId)) || { nombre: 'Desconocido' }
      })).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    } catch (e) { return []; }
  },

  aprobarReporte: async (reporteId) => {
    try {
      // 1. Obtener el reporte para saber a qué tarea pertenece
      const resRep = await fetch(`http://localhost:5000/reportes/${reporteId}`);
      if (!resRep.ok) return { success: false };
      const reporte = await resRep.json();

      // 2. Aprobar el reporte
      const response = await fetch(`http://localhost:5000/reportes/${reporteId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'aprobado', observacionRechazo: null })
      });
      if (!response.ok) return { success: false };

      // 3. Actualizar los datos de seguimiento en la tarea
      if (reporte.tareaId) {
        // Obtenemos todos los reportes aprobados para esta tarea para calcular el progreso total
        const [resRep, resTarea] = await Promise.all([
          fetch(`http://localhost:5000/reportes?tareaId=${reporte.tareaId}&estado=aprobado`),
          fetch(`http://localhost:5000/tareas/${reporte.tareaId}`)
        ]);
        
        const reportesAprobados = resRep.ok ? await resRep.json() : [];
        const tareaActual = resTarea.ok ? await resTarea.json() : {};

        // Calcular avance acumulado
        let avanceTotal = reportesAprobados.reduce((sum, r) => sum + (parseInt(r.beneficiados) || 0), 0);
        const metaNum = parseInt(tareaActual.meta) || 1;
        const reachedMeta = avanceTotal >= metaNum;

        const updatePayload = {
          evidenciaSeguimiento: reporte.descripcion,
          ultimoAvance: reporte.fecha,
          reporteInstitucion: reporte.descripcion,
          inversionColones: reportesAprobados.reduce((sum, r) => sum + (r.inversionColones || 0), 0),
          estado: reachedMeta ? 'Completado' : 'Con Actividades',
          completada: reachedMeta,
          fechaCompletada: reachedMeta ? new Date().toISOString().split('T')[0] : null
        };

        await fetch(`http://localhost:5000/tareas/${reporte.tareaId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatePayload)
        });
      }

      return { success: true };
    } catch (e) { return { success: false }; }
  },

  editarReporte: async (reporteId, nuevosDatos) => {
    try {
      const currentRes = await fetch(`http://localhost:5000/reportes/${reporteId}`);
      if (!currentRes.ok) return { success: false };
      const reporte = await currentRes.json();
      
      const payload = {
        descripcion: nuevosDatos.descripcion !== undefined ? nuevosDatos.descripcion : reporte.descripcion,
        beneficiados: nuevosDatos.beneficiados !== undefined ? nuevosDatos.beneficiados : reporte.beneficiados,
        editadoPorAdmin: true
      };
      if (nuevosDatos.asistentes) payload.asistentes = { ...reporte.asistentes, ...nuevosDatos.asistentes };
      
      const response = await fetch(`http://localhost:5000/reportes/${reporteId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return { success: response.ok };
    } catch (e) { return { success: false }; }
  },

  rechazarReporte: async (reporteId, observacion) => {
    try {
      const response = await fetch(`http://localhost:5000/reportes/${reporteId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'rechazado', observacionRechazo: observacion })
      });
      return { success: response.ok };
    } catch (e) { return { success: false }; }
  },

  getHistorial: async (filtros = {}) => {
    try {
      const [resReq, tareasReq, usersReq] = await Promise.all([
        fetch('http://localhost:5000/reportes'),
        fetch('http://localhost:5000/tareas'),
        fetch('http://localhost:5000/usuarios')
      ]);
      const reportes = await resReq.json();
      const tareas = await tareasReq.json();
      const usuarios = await usersReq.json();
      
      let misReportes = reportes.filter(r => tareas.some(t => String(t.id) === String(r.tareaId)));
      
      let resultado = misReportes.map(r => ({
        ...r,
        tarea: tareas.find(t => String(t.id) === String(r.tareaId)) || {},
        responsable: usuarios.find(u => String(u.id) === String(r.responsableId)) || {}
      }));

      // Filtros base
      if (filtros.estado && filtros.estado !== 'Todos') resultado = resultado.filter(r => r.estado === filtros.estado);
      if (filtros.responsableId && filtros.responsableId !== 'Todos') resultado = resultado.filter(r => String(r.responsableId) === String(filtros.responsableId));
      if (filtros.institucionId && filtros.institucionId !== 'Todos') {
        const targetId = String(filtros.institucionId);
        resultado = resultado.filter(r => String(r.tarea?.institucionId) === targetId);
      }
      if (filtros.lineaId && filtros.lineaId !== 'Todos') resultado = resultado.filter(r => r.tarea?.lineaAccionId === filtros.lineaId);
      
      // Filtro de Búsqueda
      if (filtros.busqueda) {
        const q = filtros.busqueda.toLowerCase();
        resultado = resultado.filter(r => 
          r.tarea?.titulo?.toLowerCase().includes(q) || 
          r.descripcion?.toLowerCase().includes(q) ||
          r.accionEstrategica?.toLowerCase().includes(q)
        );
      }

      // Filtro de Rango de Tiempo
      if (filtros.rango && filtros.rango !== 'Todos') {
        const hoy = new Date();
        resultado = resultado.filter(r => {
          const fechaRep = new Date(r.fecha);
          if (filtros.rango === 'Hoy') {
            return fechaRep.toDateString() === hoy.toDateString();
          }
          if (filtros.rango === 'Semana') {
            const haceUnaSemana = new Date();
            haceUnaSemana.setDate(hoy.getDate() - 7);
            return fechaRep >= haceUnaSemana;
          }
          return true;
        });
      }

      return resultado.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    } catch (e) { return []; }
  },

  getCalendarioTareas: async (institucionId) => {
    try {
      const res = await fetch('http://localhost:5000/tareas');
      const allTareas = await res.json();
      const tareas = allTareas.filter(t => {
        if (t.institucionesIds && Array.isArray(t.institucionesIds)) {
          return t.institucionesIds.includes(String(institucionId));
        }
        return String(t.institucionId) === String(institucionId);
      });
      return tareas.map(t => ({
        id: t.id,
        titulo: t.titulo,
        fecha: t.fechaLimite,
        estado: t.estado,
        lineaNombre: t.lineaNombre,
        lineaNumero: t.lineaNumero,
        zona: t.zona,
        prioridad: t.prioridad,
      }));
    } catch (e) { return []; }
  },
};
