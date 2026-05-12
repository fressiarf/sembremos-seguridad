'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cat_clasificacion_intel', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      nombre: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      nivel_acceso: { type: Sequelize.INTEGER, allowNull: false }
    });
  },
  async down(queryInterface) { await queryInterface.dropTable('cat_clasificacion_intel'); }
};
