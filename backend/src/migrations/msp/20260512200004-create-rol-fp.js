'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('roles_fp', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      nombre: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      permisos: {
        type: Sequelize.JSON,
        allowNull: true
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('roles_fp');
  }
};
