'use strict';
module.exports = {
  async up(qi, S) {
    await qi.createTable('adjuntos_informe', {
      id: { type: S.UUID, primaryKey: true, defaultValue: S.UUIDV4, allowNull: false },
      informe_id: { type: S.UUID, allowNull: false, references: { model: 'informes_d71', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      nombre_archivo: { type: S.STRING(200), allowNull: false },
      url_archivo: { type: S.STRING(500), allowNull: false },
      tipo_mime: { type: S.STRING(100), allowNull: true },
      created_at: { type: S.DATE, allowNull: false, defaultValue: S.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: S.DATE, allowNull: false, defaultValue: S.literal('CURRENT_TIMESTAMP') }
    });
  },
  async down(qi) { await qi.dropTable('adjuntos_informe'); }
};
