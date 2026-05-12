/**
 * Helper para manejar la paginación en Sequelize (Requerimiento RF-03)
 * @param {number} page - Número de página (empezando en 1)
 * @param {number} size - Cantidad de registros por página
 * @returns {object} - Objeto con limit y offset
 */
const getPagination = (page, size) => {
  const limit = size ? +size : 10; // Por defecto 10 registros
  const offset = page ? (page - 1) * limit : 0;

  return { limit, offset };
};

/**
 * Formatea la respuesta paginada para enviarla al cliente
 * @param {object} data - Resultado de findAndCountAll de Sequelize
 * @param {number} page - Página actual
 * @param {number} limit - Límite de registros por página
 * @returns {object} - Respuesta estructurada
 */
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: items } = data;
  const currentPage = page ? +page : 1;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    totalItems,
    items,
    totalPages,
    currentPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
};

module.exports = {
  getPagination,
  getPagingData
};
