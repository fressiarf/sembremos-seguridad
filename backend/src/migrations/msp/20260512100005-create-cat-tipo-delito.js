'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cat_tipo_delito', {
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
      categoria: {
        type: Sequelize.STRING(100),
        allowNull: false
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('cat_tipo_delito');
  }
};
