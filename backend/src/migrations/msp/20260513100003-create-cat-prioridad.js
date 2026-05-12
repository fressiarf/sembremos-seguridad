'use strict';
module.exports = {
  async up(qi, S) {
    await qi.createTable('cat_prioridad', {
      id: { type: S.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      nombre: { type: S.STRING(50), allowNull: false, unique: true },
      color_hex: { type: S.STRING(10), allowNull: true },
      orden: { type: S.INTEGER, allowNull: false, defaultValue: 0 }
    });
  },
  async down(qi) { await qi.dropTable('cat_prioridad'); }
};
