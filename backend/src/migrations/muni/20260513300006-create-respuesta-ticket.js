'use strict';
module.exports = {
  async up(qi, S) {
    await qi.createTable('respuestas_ticket', {
      id: { type: S.UUID, primaryKey: true, defaultValue: S.UUIDV4, allowNull: false },
      ticket_id: { type: S.UUID, allowNull: false, references: { model: 'soporte_tickets', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      autor_id: { type: S.UUID, allowNull: false, references: { model: 'usuarios_local', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
      contenido: { type: S.TEXT, allowNull: false },
      created_at: { type: S.DATE, allowNull: false, defaultValue: S.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: S.DATE, allowNull: false, defaultValue: S.literal('CURRENT_TIMESTAMP') }
    });
  },
  async down(qi) { await qi.dropTable('respuestas_ticket'); }
};
