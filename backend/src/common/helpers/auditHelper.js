/**
 * auditHelper.js
 * 
 * Helper centralizado de auditoría para el sistema dual MSP/MUNI.
 * Proporciona funciones reutilizables para registrar automáticamente
 * las acciones de CREATE, UPDATE y DELETE en las tablas de logs.
 * 
 * Uso en hooks de Sequelize:
 *   - Pasar `options.userId` desde el controlador para identificar al actor.
 *   - Si no se pasa userId, el log se registra como acción de sistema.
 */

/**
 * Registra una acción de auditoría en la tabla de logs correspondiente.
 * 
 * @param {Object} params
 * @param {Object} params.LogModel - El modelo de log (LogAuditoriaFP o LogAuditoriaLocal)
 * @param {string} params.accion - Tipo de acción: 'CREATE', 'UPDATE', 'DELETE'
 * @param {string} params.entidad - Nombre de la tabla/entidad afectada
 * @param {string} params.entidad_id - ID del registro afectado
 * @param {Object|null} params.datosAnteriores - Snapshot de datos antes del cambio
 * @param {Object|null} params.datosNuevos - Snapshot de datos después del cambio
 * @param {string|null} params.usuarioId - UUID del usuario que realizó la acción
 */
const registrarAuditoria = async ({ LogModel, accion, entidad, entidad_id, datosAnteriores, datosNuevos, usuarioId }) => {
  try {
    await LogModel.create({
      usuario_id: usuarioId || '00000000-0000-0000-0000-000000000000',
      accion,
      entidad,
      entidad_id: String(entidad_id),
      datos_anteriores: datosAnteriores || null,
      datos_nuevos: datosNuevos || null
    });
  } catch (error) {
    // Nunca dejar que un error de auditoría rompa la operación principal
    console.error(`[AUDIT ERROR] No se pudo registrar ${accion} en ${entidad}:`, error.message);
  }
};

/**
 * Genera los hooks afterCreate, afterUpdate y afterDelete para un modelo.
 * 
 * @param {Object} LogModel - Modelo de log donde se persiste la auditoría
 * @param {string} entidad - Nombre descriptivo de la entidad (ej: 'LineaAccion')
 * @param {string[]} [camposExcluidos] - Campos a excluir del log (ej: password_hash)
 * @returns {Object} Objeto con los 3 hooks listos para inyectar
 */
const generarHooksAuditoria = (LogModel, entidad, camposExcluidos = ['password_hash', 'password']) => {

  const limpiarDatos = (dataValues) => {
    if (!dataValues) return null;
    const copia = { ...dataValues };
    camposExcluidos.forEach(campo => delete copia[campo]);
    return copia;
  };

  return {
    afterCreate: async (instance, options) => {
      await registrarAuditoria({
        LogModel,
        accion: 'CREATE',
        entidad,
        entidad_id: instance.id,
        datosAnteriores: null,
        datosNuevos: limpiarDatos(instance.dataValues),
        usuarioId: options.userId || null
      });
    },

    afterUpdate: async (instance, options) => {
      // Calcular solo los campos que cambiaron (diff)
      const camposModificados = instance.changed();
      if (!camposModificados || camposModificados.length === 0) return;

      const anteriores = {};
      const nuevos = {};
      camposModificados.forEach(campo => {
        if (!camposExcluidos.includes(campo)) {
          anteriores[campo] = instance.previous(campo);
          nuevos[campo] = instance.getDataValue(campo);
        }
      });

      // Si después de filtrar no queda nada relevante, no logear
      if (Object.keys(nuevos).length === 0) return;

      await registrarAuditoria({
        LogModel,
        accion: 'UPDATE',
        entidad,
        entidad_id: instance.id,
        datosAnteriores: anteriores,
        datosNuevos: nuevos,
        usuarioId: options.userId || null
      });
    },

    afterDestroy: async (instance, options) => {
      await registrarAuditoria({
        LogModel,
        accion: 'DELETE',
        entidad,
        entidad_id: instance.id,
        datosAnteriores: limpiarDatos(instance.dataValues),
        datosNuevos: null,
        usuarioId: options.userId || null
      });
    }
  };
};

module.exports = { registrarAuditoria, generarHooksAuditoria };
