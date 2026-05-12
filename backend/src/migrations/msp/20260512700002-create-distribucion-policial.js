'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('distribucion_policial', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false
      },
      zona_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'zonas_riesgo',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      cantidad_oficiales: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      turno_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'cat_turno',
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
    await queryInterface.dropTable('distribucion_policial');
  }
};
