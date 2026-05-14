'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('historial_ia', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false
      },
      usuario_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'usuarios_fp',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      pregunta: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      respuesta: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      modulo: {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: 'Módulo desde donde se hizo la consulta (dashboard, incidentes, estrategia, etc.)'
      },
      tokens_usados: {
        type: Sequelize.INTEGER,
        allowNull: true,
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

    // Índice para buscar historial por usuario rápidamente
    await queryInterface.addIndex('historial_ia', ['usuario_id'], {
      name: 'idx_historial_ia_usuario'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('historial_ia');
  }
};
