'use strict';
module.exports = {
  async up(qi, S) {
    await qi.createTable('soporte_tickets', {
      id: { type: S.UUID, primaryKey: true, defaultValue: S.UUIDV4, allowNull: false },
      usuario_id: { type: S.UUID, allowNull: false, references: { model: 'usuarios_local', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      asunto: { type: S.STRING(200), allowNull: false },
      mensaje: { type: S.TEXT, allowNull: false },
      prioridad_id: { type: S.INTEGER, allowNull: false, references: { model: 'cat_prioridad_ticket', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
      estado_id: { type: S.INTEGER, allowNull: false, references: { model: 'cat_estado_ticket', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
      fecha_cierre: { type: S.DATE, allowNull: true },
      created_at: { type: S.DATE, allowNull: false, defaultValue: S.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: S.DATE, allowNull: false, defaultValue: S.literal('CURRENT_TIMESTAMP') }
    });
  },
  async down(qi) { await qi.dropTable('soporte_tickets'); }
};
