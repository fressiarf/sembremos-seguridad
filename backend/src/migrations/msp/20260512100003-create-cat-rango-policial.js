'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cat_rango_policial', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      nivel_jerarquico: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('cat_rango_policial');
  }
};
