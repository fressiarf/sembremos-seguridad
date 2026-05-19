'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('usuarios_fp');
    if (!tableDefinition.ultimo_acceso) {
      await queryInterface.addColumn('usuarios_fp', 'ultimo_acceso', {
        type: Sequelize.DATE,
        allowNull: true
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('usuarios_fp');
    if (tableDefinition.ultimo_acceso) {
      await queryInterface.removeColumn('usuarios_fp', 'ultimo_acceso');
    }
  }
};
