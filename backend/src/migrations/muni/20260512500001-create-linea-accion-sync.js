'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('lineas_accion_sync', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
      },
      titulo: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      problematica: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      objetivo_general: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('lineas_accion_sync');
  }
};
