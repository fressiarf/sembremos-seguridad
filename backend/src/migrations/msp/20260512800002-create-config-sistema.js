'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('config_sistema', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      clave: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      valor: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      descripcion: {
        type: Sequelize.STRING(255),
        allowNull: true
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('config_sistema');
  }
};
