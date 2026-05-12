// ─────────────────────────────────────────────────────────
//  Servicio: Informes Trimestrales de Avance
//  Gestiona CRUD, workflow de aprobación y notificaciones
// ─────────────────────────────────────────────────────────

const API = 'http://localhost:5000';

export const ESTADOS_INFORME = {
  BORRADOR: 'BORRADOR',
  PENDIENTE_ADMIN: 'PENDIENTE_ADMIN',
  RECHAZADO: 'RECHAZADO',
  APROBADO_INSTITUCIONAL: 'APROBADO_INSTITUCIONAL',
};

export const LINEAS_ESTRATEGICAS = [
  'Recuperación de Espacios Públicos',
  'Prevención Social y Comunitaria',
  'Reducción de Venta de Drogas',
  'Reducción de Consumo de Alcohol y Drogas',
  'Atención a Personas en Situación de Calle',
  'Seguridad Ciudadana y Patrullaje',
  'Educación y Prevención Juvenil',
  'Gestión Interinstitucional',
];

export const TRIMESTRES = [
  { value: '2026-Q1', label: 'I Trimestre 2026 (Ene - Mar)' },
  { value: '2026-Q2', label: 'II Trimestre 2026 (Abr - Jun)' },
  { value: '2026-Q3', label: 'III Trimestre 2026 (Jul - Sep)' },
  { value: '2026-Q4', label: 'IV Trimestre 2026 (Oct - Dic)' },
];

// ── CRUD ──

export const informesService = {

  // Obtener todos los informes
  async getAll() {
    const res = await fetch(`${API}/informes_trimestrales`);
    if (!res.ok) throw new Error('Error al obtener informes');
    return res.json();
  },

  // Obtener informes por institución
  async getByInstitucion(institucion) {
    const all = await this.getAll();
    return all.filter(i => i.institucion === institucion);
  },

  // Obtener informes por usuario editor
  async getByEditor(userId) {
    const all = await this.getAll();
    return all.filter(i => i.editorId === userId);
  },

  // Obtener sólo los aprobados (para vista consolidada)
  async getAprobados() {
    const all = await this.getAll();
    return all.filter(i => i.estado === ESTADOS_INFORME.APROBADO_INSTITUCIONAL);
  },

  // Obtener informes pendientes de revisión para un admin institucional
  async getPendientesAdmin(institucion) {
    const all = await this.getAll();
    return all.filter(i => i.institucion === institucion && i.estado === ESTADOS_INFORME.PENDIENTE_ADMIN);
  },

  // Crear un nuevo informe
  async crear(informe) {
    const res = await fetch(`${API}/informes_trimestrales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(informe),
    });
    if (!res.ok) throw new Error('Error al crear informe');
    return res.json();
  },

  // Actualizar un informe existente
  async actualizar(id, data) {
    const res = await fetch(`${API}/informes_trimestrales/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al actualizar informe');
    return res.json();
  },

  // ── WORKFLOW ──

  // Editor envía informe → PENDIENTE_ADMIN
  async enviar(id, userId, userName) {
    const informe = await this.actualizar(id, {
      estado: ESTADOS_INFORME.PENDIENTE_ADMIN,
      fechaEnvio: new Date().toISOString(),
    });

    // Registrar en historial
    await this.agregarHistorial(id, {
      accion: 'ENVIADO',
      usuario: userName,
      usuarioId: userId,
      fecha: new Date().toISOString(),
      detalle: 'Informe enviado para revisión administrativa.',
    });

    // Crear notificación para admin
    await this.crearNotificacion({
      tipo: 'INFORME_NUEVO',
      titulo: `Nuevo informe trimestral recibido`,
      mensaje: `${userName} envió un informe trimestral para revisión.`,
      institucion: informe.institucion,
      informeId: id,
      leida: false,
    });

    return informe;
  },

  // Admin aprueba informe → APROBADO_INSTITUCIONAL
  async aprobar(id, adminName, adminId) {
    const informe = await this.actualizar(id, {
      estado: ESTADOS_INFORME.APROBADO_INSTITUCIONAL,
      fechaAprobacion: new Date().toISOString(),
      aprobadoPor: adminName,
      aprobadoPorId: adminId,
    });

    await this.agregarHistorial(id, {
      accion: 'APROBADO',
      usuario: adminName,
      usuarioId: adminId,
      fecha: new Date().toISOString(),
      detalle: 'Informe aprobado por administración institucional.',
    });

    return informe;
  },

  // Admin rechaza informe → RECHAZADO
  async rechazar(id, adminName, adminId, comentario) {
    const informe = await this.actualizar(id, {
      estado: ESTADOS_INFORME.RECHAZADO,
      fechaRechazo: new Date().toISOString(),
      comentarioRechazo: comentario,
      rechazadoPor: adminName,
      rechazadoPorId: adminId,
    });

    await this.agregarHistorial(id, {
      accion: 'RECHAZADO',
      usuario: adminName,
      usuarioId: adminId,
      fecha: new Date().toISOString(),
      detalle: `Rechazado: ${comentario}`,
    });

    return informe;
  },

  // Editor corrige y reenvía un informe rechazado
  async reenviar(id, filas, userId, userName) {
    const informe = await this.actualizar(id, {
      estado: ESTADOS_INFORME.PENDIENTE_ADMIN,
      filas,
      fechaReenvio: new Date().toISOString(),
      comentarioRechazo: null,
    });

    await this.agregarHistorial(id, {
      accion: 'REENVIADO',
      usuario: userName,
      usuarioId: userId,
      fecha: new Date().toISOString(),
      detalle: 'Informe corregido y reenviado.',
    });

    return informe;
  },

  // ── HISTORIAL ──

  async getHistorial(informeId) {
    const res = await fetch(`${API}/historial_informes?informeId=${informeId}&_sort=fecha&_order=desc`);
    if (!res.ok) return [];
    return res.json();
  },

  async agregarHistorial(informeId, entrada) {
    const id = `HI-${Date.now().toString(36)}`;
    await fetch(`${API}/historial_informes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, informeId, ...entrada }),
    });
  },

  // ── NOTIFICACIONES ──

  async crearNotificacion(notif) {
    const id = `NIT-${Date.now().toString(36)}`;
    await fetch(`${API}/notificaciones_informes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        ...notif,
        timestamp: new Date().toISOString(),
      }),
    });
  },

  async getNotificaciones(institucion) {
    try {
      const res = await fetch(`${API}/notificaciones_informes`);
      if (!res.ok) return [];
      const all = await res.json();
      return all.filter(n => n.institucion === institucion && !n.leida);
    } catch {
      return [];
    }
  },

  async marcarNotificacionLeida(id) {
    await fetch(`${API}/notificaciones_informes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leida: true }),
    });
  },
};
