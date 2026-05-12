'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cat_zona_ejecucion', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      nombre: { type: Sequelize.STRING(150), allowNull: false },
      canton_id: { type: Sequelize.INTEGER, allowNull: true }
    });
  },
  async down(queryInterface) { await queryInterface.dropTable('cat_zona_ejecucion'); }
};
