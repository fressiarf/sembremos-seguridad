'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('kpis_local_sync', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        comment: 'Mismo UUID que el KPI original en MSP'
      },
      accion_nombre: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      nombre_indicador: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      valor_meta: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0
      },
      valor_actual: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0
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
    await queryInterface.dropTable('kpis_local_sync');
  }
};
