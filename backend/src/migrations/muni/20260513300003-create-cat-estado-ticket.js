'use strict';
module.exports = {
  async up(qi, S) {
    await qi.createTable('cat_estado_ticket', {
      id: { type: S.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      nombre: { type: S.STRING(50), allowNull: false, unique: true }
    });
  },
  async down(qi) { await qi.dropTable('cat_estado_ticket'); }
};
