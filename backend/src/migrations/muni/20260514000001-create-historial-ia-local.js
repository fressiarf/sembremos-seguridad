'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('historial_ia_local', {
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
          model: 'usuarios_local',
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
        allowNull: true
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

    await queryInterface.addIndex('historial_ia_local', ['usuario_id'], {
      name: 'idx_historial_ia_local_usuario'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('historial_ia_local');
  }
};
