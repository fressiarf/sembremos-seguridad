const { 
  LineaAccion, 
  LineaAccionSync, 
  AccionEstrategica, 
  Canton, 
  UsuarioFP,
  KpiNacional
} = require('../../models');

/**
 * Repository/DAO para la Entidad B (Líneas de Acción / Incidentes)
 * Proporciona una capa de abstracción para las consultas de base de datos,
 * manejando el flujo dual entre el Ministerio (MSP) y las Municipalidades (MUNI).
 */
class EntidadBRepository {
  /**
   * Obtiene todos los registros según el nivel de acceso (MSP o MUNI).
   * @param {string} nivel - El nivel de acceso ('MSP' o 'MUNI').
   * @param {Object} [filters={}] - Filtros adicionales (ej: canton_id).
   * @returns {Promise<Array>} - Lista de registros planos.
   */
  async getAllByLevel(nivel, filters = {}) {
    const options = {
      where: filters,
      include: this._getStandardIncludes(nivel),
      order: [['created_at', 'DESC']]
    };

    if (nivel === 'MSP') {
      const results = await LineaAccion.findAll(options);
      return results.map(r => r.get({ plain: true }));
    } else {
      // Para MUNI, usamos la tabla sincronizada
      const results = await LineaAccionSync.findAll(options);
      return results.map(r => r.get({ plain: true }));
    }
  }

  /**
   * Obtiene un registro específico por su ID.
   * @param {string} id - UUID del registro.
   * @param {string} [nivel='MSP'] - Nivel para determinar qué tabla consultar.
   * @returns {Promise<Object|null>} - El registro en formato plano.
   */
  async getById(id, nivel = 'MSP') {
    const model = nivel === 'MSP' ? LineaAccion : LineaAccionSync;
    
    return await model.findByPk(id, {
      include: this._getStandardIncludes(nivel),
      raw: true,
      nest: true // Para mantener la estructura de los objetos incluidos
    });
  }

  /**
   * Crea un nuevo registro en el nivel MSP.
   * @param {Object} data - Datos para la creación.
   * @returns {Promise<Object>} - Registro creado.
   */
  async create(data) {
    const instance = await LineaAccion.create(data);
    return instance.get({ plain: true });
  }

  /**
   * Actualiza un registro existente.
   * @param {string} id - ID del registro.
   * @param {Object} data - Datos a actualizar.
   * @returns {Promise<Object|null>} - Registro actualizado.
   */
  async update(id, data) {
    const instance = await LineaAccion.findByPk(id);
    if (!instance) return null;

    await instance.update(data);
    return instance.get({ plain: true });
  }

  /**
   * Elimina un registro.
   * @param {string} id - ID del registro.
   * @returns {Promise<boolean>} - True si se eliminó, false si no.
   */
  async delete(id) {
    const deleted = await LineaAccion.destroy({
      where: { id }
    });
    return deleted > 0;
  }

  /**
   * Helper privado para definir los includes estándar según el nivel.
   * @private
   */
  _getStandardIncludes(nivel) {
    if (nivel === 'MSP') {
      return [
        { 
          model: Canton, 
          as: 'canton' 
        },
        { 
          model: UsuarioFP, 
          as: 'responsable',
          attributes: ['id', 'nombre', 'apellido', 'email'] // Seguridad: no devolver hash
        },
        {
          model: AccionEstrategica,
          as: 'acciones',
          include: [{ model: KpiNacional, as: 'kpis' }]
        }
      ];
    } else {
      // En MUNI, las relaciones pueden ser diferentes o limitadas a lo sincronizado
      return [
        {
          model: require('../../models').ActividadLocal, // Eager loading si existe relación
          as: 'actividades',
          required: false
        }
      ];
    }
  }
}

module.exports = new EntidadBRepository();
