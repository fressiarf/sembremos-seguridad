import { apiFetch } from '../utils/apiFetch';

/**
 * Servicio para el sistema de recordatorios de eventos del calendario.
 * Cubre listado de próximos avisos del usuario y sus preferencias de correo.
 */
export const recordatorioService = {
  /**
   * Devuelve los recordatorios pendientes del usuario actual (creador del evento)
   * ordenados por proximidad. Array de filas con shape:
   * {
   *   id, evento_id, offset_minutos, programado_para, estado,
   *   evento: { id, titulo, descripcion, fecha_inicio, fecha_fin }
   * }
   */
  getProximos: async (limit = 20) => {
    try {
      const response = await apiFetch(`/api/v1/muni/recordatorios/proximos?limit=${limit}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('[recordatorioService.getProximos]', error.message);
      return [];
    }
  },

  /**
   * Lee la preferencia `recibe_recordatorios` del usuario actual.
   * @returns {Promise<{recibe_recordatorios: boolean}>}
   */
  getPreferencias: async () => {
    try {
      const response = await apiFetch('/api/v1/muni/usuarios/me/preferencias');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('[recordatorioService.getPreferencias]', error.message);
      return { recibe_recordatorios: true };
    }
  },

  /**
   * Actualiza la preferencia de recibir correos.
   * @param {boolean} recibe
   * @returns {Promise<{recibe_recordatorios: boolean}|null>}
   */
  setRecibirRecordatorios: async (recibe) => {
    try {
      const response = await apiFetch('/api/v1/muni/usuarios/me/preferencias', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recibe_recordatorios: !!recibe })
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('[recordatorioService.setRecibirRecordatorios]', error.message);
      return null;
    }
  }
};

/**
 * Helper: formatea el offset en humano. Coincide con backend RecordatorioFormatter.
 */
export const formatearAvisoTiempo = (offsetMinutos) => {
  if (offsetMinutos >= 1440) {
    const dias = Math.round(offsetMinutos / 1440);
    return dias === 1 ? 'Es mañana' : `Faltan ${dias} días`;
  }
  if (offsetMinutos >= 60) {
    const horas = Math.round(offsetMinutos / 60);
    return horas === 1 ? 'Falta 1 hora' : `Faltan ${horas} horas`;
  }
  return offsetMinutos === 1 ? 'Falta 1 minuto' : `Faltan ${offsetMinutos} minutos`;
};

/**
 * Cuenta regresiva en tiempo real para el evento (no para el aviso).
 * Devuelve string corto: "en 3 d", "en 5 h", "en 12 min", "ahora".
 */
export const cuentaRegresiva = (fechaIso) => {
  const diff = new Date(fechaIso).getTime() - Date.now();
  if (diff <= 0) return 'ahora';
  const min = Math.floor(diff / 60000);
  if (min < 60) return `en ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `en ${h} h`;
  const d = Math.floor(h / 24);
  return `en ${d} d`;
};
