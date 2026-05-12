'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('actividades_local', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false
      },
      linea_sync_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'lineas_accion_sync',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      titulo: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      descripcion_operativa: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      tipo_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'cat_tipo_actividad',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      estado_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'cat_estado_actividad',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      presupuesto_asignado: {
        type: Sequelize.DECIMAL(14, 2),
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
    await queryInterface.dropTable('actividades_local');
  }
};
