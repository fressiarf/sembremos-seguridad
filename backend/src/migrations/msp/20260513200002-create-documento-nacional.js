'use strict';
module.exports = {
  async up(qi, S) {
    await qi.createTable('documentos_nacionales', {
      id: { type: S.UUID, primaryKey: true, defaultValue: S.UUIDV4, allowNull: false },
      titulo: { type: S.STRING(200), allowNull: false },
      categoria_id: { type: S.INTEGER, allowNull: false, references: { model: 'cat_categoria_doc', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
      url_archivo: { type: S.STRING(500), allowNull: false },
      version: { type: S.STRING(20), allowNull: true },
      publicado_por: { type: S.UUID, allowNull: false, references: { model: 'usuarios_fp', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
      created_at: { type: S.DATE, allowNull: false, defaultValue: S.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: S.DATE, allowNull: false, defaultValue: S.literal('CURRENT_TIMESTAMP') }
    });
  },
  async down(qi) { await qi.dropTable('documentos_nacionales'); }
};
