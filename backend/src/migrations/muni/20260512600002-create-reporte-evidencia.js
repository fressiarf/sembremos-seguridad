'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reportes_evidencia', {
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
      autor_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'usuarios_local',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      descripcion_logro: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      impacto_comunidad: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      estado_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'cat_estado_reporte',
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
    await queryInterface.dropTable('reportes_evidencia');
  }
};
