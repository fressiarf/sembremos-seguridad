'use strict';
module.exports = {
  async up(qi, S) {
    await qi.addColumn('eventos_calendario', 'participantes_instituciones', {
      type: S.JSON,
      allowNull: true,
      comment: 'Array de nombres de instituciones participantes (ej: ["IMAS","CCSS"])'
    });
  },
  async down(qi) {
    await qi.removeColumn('eventos_calendario', 'participantes_instituciones');
  }
};
