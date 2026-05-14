/**
 * @file roleMiddleware.js
 * @description Middleware RBAC (Role-Based Access Control) para Sembremos Seguridad.
 *
 * Implementa el patrón Higher-Order Function para controlar el acceso a rutas
 * protegidas según el rol del usuario autenticado.
 *
 * IMPORTANTE: Este middleware debe ejecutarse SIEMPRE después de authMiddleware,
 * ya que depende del objeto req.user que éste inyecta.
 *
 * @usage
 *   const { authorizeRoles } = require('../common/middlewares/roleMiddleware');
 *
 *   // Ruta accesible solo para administradores del MSP:
 *   router.get('/inteligencia-tactica', authMiddleware, authorizeRoles(['ADMIN_MSP']), controller.get);
 *
 *   // Ruta accesible para administradores de ambos niveles:
 *   router.post('/presupuesto', authMiddleware, authorizeRoles(['ADMIN_MSP', 'ADMIN_MUNI']), controller.post);
 */

/**
 * Roles válidos del sistema Sembremos Seguridad.
 * Sirve como referencia y fuente de verdad de los roles existentes.
 *
 * Nivel MSP (Ministerio de Seguridad Pública / Fuerza Pública):
 *   - ADMIN_MSP   : Acceso global. Dashboard estratégico, inteligencia táctica, gestión de usuarios.
 *   - OFICIAL_MSP : Acceso operativo. Zonas críticas, distribución policial, incidentes delictivos.
 *
 * Nivel MUNI (Municipalidades):
 *   - ADMIN_MUNI  : Acceso municipal completo. Actividades, presupuestos, revisión de reportes.
 *   - GESTOR_MUNI : Acceso de campo. Carga de evidencia, reportes propios, hitos de actividad.
 */
const ROLES = {
  ADMIN_MSP:   'ADMIN_MSP',
  OFICIAL_MSP: 'OFICIAL_MSP',
  ADMIN_MUNI:  'ADMIN_MUNI',
  GESTOR_MUNI: 'GESTOR_MUNI',
};

/**
 * Middleware de autorización basado en roles (RBAC).
 *
 * Función de orden superior que recibe un array de roles permitidos y retorna
 * el middleware de Express que valida si el usuario autenticado posee uno de
 * esos roles.
 *
 * Flujo de validación:
 *   1. Verifica que req.user exista (inyectado previamente por authMiddleware).
 *   2. Comprueba si req.user.role está incluido en el array `allowedRoles`.
 *   3. Si coincide → llama a next() y permite el acceso al controlador.
 *   4. Si no coincide → responde con 403 Forbidden.
 *
 * @param {string[]} allowedRoles - Array de roles con permiso de acceso a la ruta.
 *                                  Ej: ['ADMIN_MSP', 'OFICIAL_MSP']
 * @returns {Function} Middleware de Express (req, res, next).
 */
const authorizeRoles = (allowedRoles) => {
  return (req, res, next) => {

    // 1. Verificar que req.user fue inyectado por authMiddleware.
    //    Si no existe, es un problema de configuración de la cadena de middlewares.
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        status: 'fail',
        message: 'Acceso denegado. No se pudo identificar al usuario en el sistema.'
      });
    }

    // 2. Comprobar si el rol del usuario está entre los roles autorizados para esta ruta.
    const userRole = req.user.role;
    const hasPermission = allowedRoles.includes(userRole);

    if (!hasPermission) {
      return res.status(403).json({
        status: 'fail',
        message: `Acceso denegado. El rol '${userRole}' no tiene permisos suficientes para acceder a este recurso de seguridad.`,
        data: {
          userRole,
          requiredRoles: allowedRoles
        }
      });
    }

    // 3. Rol válido: continuar con la cadena de middlewares / controlador.
    next();
  };
};

module.exports = { authorizeRoles, ROLES };
