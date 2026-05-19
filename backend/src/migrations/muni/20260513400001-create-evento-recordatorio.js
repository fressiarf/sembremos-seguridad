'use strict';
module.exports = {
  async up(qi, S) {
    await qi.createTable('eventos_recordatorios', {
      id: { type: S.UUID, primaryKey: true, defaultValue: S.UUIDV4, allowNull: false },
      evento_id: { type: S.UUID, allowNull: false, references: { model: 'eventos_calendario', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      offset_minutos: { type: S.INTEGER, allowNull: false },
      programado_para: { type: S.DATE, allowNull: false },
      estado: { type: S.ENUM('pendiente', 'enviando', 'enviado', 'omitido', 'fallido'), allowNull: false, defaultValue: 'pendiente' },
      enviado_en: { type: S.DATE, allowNull: true },
      intentos: { type: S.INTEGER, allowNull: false, defaultValue: 0 },
      ultimo_error: { type: S.TEXT, allowNull: true },
      created_at: { type: S.DATE, allowNull: false, defaultValue: S.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: S.DATE, allowNull: false, defaultValue: S.literal('CURRENT_TIMESTAMP') }
    });

    await qi.addConstraint('eventos_recordatorios', {
      fields: ['evento_id', 'offset_minutos'],
      type: 'unique',
      name: 'uq_evento_offset'
    });

    await qi.addIndex('eventos_recordatorios', ['estado', 'programado_para'], { name: 'idx_estado_programado' });
  },
  async down(qi) {
    await qi.dropTable('eventos_recordatorios');
  }
};
