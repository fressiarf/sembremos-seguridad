'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cat_nivel_riesgo', {
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
      color_hex: {
        type: Sequelize.STRING(7),
        allowNull: false
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('cat_nivel_riesgo');
  }
};
