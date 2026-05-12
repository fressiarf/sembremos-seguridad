'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('lineas_accion', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false
      },
      titulo: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      problematica: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      objetivo_general: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      canton_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'cantones',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      responsable_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'usuarios_fp',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
    await queryInterface.dropTable('lineas_accion');
  }
};
