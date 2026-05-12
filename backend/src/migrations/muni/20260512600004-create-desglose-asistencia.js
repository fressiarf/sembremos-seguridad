'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('desglose_asistencia', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false
      },
      reporte_id: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        references: {
          model: 'reportes_evidencia',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      ninos: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      jovenes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      adultos: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('desglose_asistencia');
  }
};
