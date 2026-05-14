/**
 * Wrapper de fetch con cookies JWT incluidas automáticamente.
 * 
 * TODAS las peticiones del frontend deben usar este helper
 * para que la cookie HTTP-Only 'token' se adjunte siempre.
 * 
 * @example
 *   import { apiFetch } from '../utils/apiFetch';
 *   const data = await apiFetch('/tareas');
 *   const result = await apiFetch('/reportes', { method: 'POST', body: JSON.stringify(payload) });
 */
const BASE_URL = 'http://localhost:5000';

export async function apiFetch(path, options = {}) {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;

  const mergedOptions = {
    ...options,
    credentials: 'include',
    headers: {
      ...options.headers,
    }
  };

  return fetch(url, mergedOptions);
}

export { BASE_URL };
