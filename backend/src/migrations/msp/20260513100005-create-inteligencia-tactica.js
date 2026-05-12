'use strict';
module.exports = {
  async up(qi, S) {
    await qi.createTable('inteligencia_tactica', {
      id: { type: S.UUID, primaryKey: true, defaultValue: S.UUIDV4, allowNull: false },
      zona_id: { type: S.UUID, allowNull: false, references: { model: 'zonas_riesgo', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      clasificacion_id: { type: S.INTEGER, allowNull: false, references: { model: 'cat_clasificacion_intel', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
      confianza_id: { type: S.INTEGER, allowNull: false, references: { model: 'cat_nivel_confianza', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
      hallazgo: { type: S.TEXT, allowNull: false },
      fuente: { type: S.STRING(200), allowNull: true },
      analista_id: { type: S.UUID, allowNull: false, references: { model: 'usuarios_fp', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
      created_at: { type: S.DATE, allowNull: false, defaultValue: S.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: S.DATE, allowNull: false, defaultValue: S.literal('CURRENT_TIMESTAMP') }
    });
  },
  async down(qi) { await qi.dropTable('inteligencia_tactica'); }
};
