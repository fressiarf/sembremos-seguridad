'use strict';
module.exports = {
  async up(qi, S) {
    await qi.createTable('aprobaciones_reporte', {
      id: { type: S.UUID, primaryKey: true, defaultValue: S.UUIDV4, allowNull: false },
      reporte_externo_ref: { type: S.STRING(100), allowNull: true },
      revisor_id: { type: S.UUID, allowNull: false, references: { model: 'usuarios_fp', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
      veredicto_id: { type: S.INTEGER, allowNull: false, references: { model: 'cat_veredicto', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
      comentario: { type: S.TEXT, allowNull: true },
      created_at: { type: S.DATE, allowNull: false, defaultValue: S.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: S.DATE, allowNull: false, defaultValue: S.literal('CURRENT_TIMESTAMP') }
    });
  },
  async down(qi) { await qi.dropTable('aprobaciones_reporte'); }
};
