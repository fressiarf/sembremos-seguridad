'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('instituciones_local', {
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
      tipo: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      activa: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
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
    await queryInterface.dropTable('instituciones_local');
  }
};
