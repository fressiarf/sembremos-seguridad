'use strict';
module.exports = {
  async up(qi, S) {
    await qi.createTable('alertas_cumplimiento', {
      id: { type: S.UUID, primaryKey: true, defaultValue: S.UUIDV4, allowNull: false },
      linea_id: { type: S.UUID, allowNull: false, references: { model: 'lineas_accion', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      institucion_ref: { type: S.STRING(150), allowNull: true },
      tipo_alerta_id: { type: S.INTEGER, allowNull: false, references: { model: 'cat_tipo_alerta', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
      prioridad_id: { type: S.INTEGER, allowNull: false, references: { model: 'cat_prioridad', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
      mensaje: { type: S.TEXT, allowNull: false },
      resuelta: { type: S.BOOLEAN, allowNull: false, defaultValue: false },
      created_at: { type: S.DATE, allowNull: false, defaultValue: S.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: S.DATE, allowNull: false, defaultValue: S.literal('CURRENT_TIMESTAMP') }
    });
  },
  async down(qi) { await qi.dropTable('alertas_cumplimiento'); }
};
