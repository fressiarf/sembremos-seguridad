'use strict';
module.exports = {
  async up(qi, S) {
    await qi.createTable('eventos_calendario', {
      id: { type: S.UUID, primaryKey: true, defaultValue: S.UUIDV4, allowNull: false },
      titulo: { type: S.STRING(200), allowNull: false },
      descripcion: { type: S.TEXT, allowNull: true },
      fecha_inicio: { type: S.DATE, allowNull: false },
      fecha_fin: { type: S.DATE, allowNull: true },
      institucion_id: { type: S.UUID, allowNull: true, references: { model: 'instituciones_local', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      creado_por: { type: S.UUID, allowNull: false, references: { model: 'usuarios_local', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
      es_publico: { type: S.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: S.DATE, allowNull: false, defaultValue: S.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: S.DATE, allowNull: false, defaultValue: S.literal('CURRENT_TIMESTAMP') }
    });
  },
  async down(qi) { await qi.dropTable('eventos_calendario'); }
};
