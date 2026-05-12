'use strict';
module.exports = {
  async up(qi, S) {
    await qi.createTable('cat_prioridad_ticket', {
      id: { type: S.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      nombre: { type: S.STRING(50), allowNull: false, unique: true },
      color_hex: { type: S.STRING(10), allowNull: true }
    });
  },
  async down(qi) { await qi.dropTable('cat_prioridad_ticket'); }
};
