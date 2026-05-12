'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('presupuesto_detalle', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false
      },
      actividad_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'actividades_local',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      concepto: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      monto_ejecutado: {
        type: Sequelize.DECIMAL(14, 2),
        allowNull: false,
        defaultValue: 0
      },
      fuente_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'cat_fuente_fondos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
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
    await queryInterface.dropTable('presupuesto_detalle');
  }
};
