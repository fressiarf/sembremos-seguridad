'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cat_turno', {
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
      hora_inicio: {
        type: Sequelize.TIME,
        allowNull: false
      },
      hora_fin: {
        type: Sequelize.TIME,
        allowNull: false
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('cat_turno');
  }
};
