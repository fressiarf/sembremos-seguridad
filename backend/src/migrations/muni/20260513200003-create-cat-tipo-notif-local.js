'use strict';
module.exports = {
  async up(qi, S) {
    await qi.createTable('cat_tipo_notif_local', {
      id: { type: S.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      nombre: { type: S.STRING(50), allowNull: false, unique: true },
      icono: { type: S.STRING(50), allowNull: true }
    });
  },
  async down(qi) { await qi.dropTable('cat_tipo_notif_local'); }
};
