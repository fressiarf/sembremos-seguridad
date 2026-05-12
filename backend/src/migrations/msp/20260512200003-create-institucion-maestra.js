'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('institucion_maestra', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false
      },
      nombre: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      siglas: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      tipo_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'cat_tipo_institucion',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
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
    await queryInterface.dropTable('institucion_maestra');
  }
};
