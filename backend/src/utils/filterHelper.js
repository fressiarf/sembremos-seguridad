const { Op } = require('sequelize');

/**
 * Helper para construir objetos 'where' de Sequelize de forma dinámica
 * @param {object} query - El objeto req.query que viene de la URL
 * @param {array} allowedFields - Lista de campos permitidos para filtrar
 * @returns {object} - Objeto 'where' para Sequelize
 */
const buildDynamicFilter = (query, allowedFields) => {
  const where = {};

  allowedFields.forEach(field => {
    if (query[field]) {
      const value = query[field];

      // Si es un campo de texto, usamos búsqueda parcial (LIKE)
      if (typeof value === 'string' && isNaN(value)) {
        where[field] = { [Op.like]: `%${value}%` };
      } 
      // Si es un ID o número, usamos coincidencia exacta
      else {
        where[field] = value;
      }
    }
  });

  return where;
};

module.exports = {
  buildDynamicFilter
};
