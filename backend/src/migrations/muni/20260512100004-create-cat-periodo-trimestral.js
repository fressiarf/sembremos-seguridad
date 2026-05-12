'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cat_periodo_trimestral', {
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
      mes_inicio: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      mes_fin: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('cat_periodo_trimestral');
  }
};
