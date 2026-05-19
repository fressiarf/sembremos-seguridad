const { DataTypes } = require('sequelize');
const { sequelizeMUNI } = require('../../config/database');

const EventoRecordatorio = sequelizeMUNI.define('EventoRecordatorio', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  evento_id: { type: DataTypes.UUID, allowNull: false, references: { model: 'eventos_calendario', key: 'id' } },
  offset_minutos: { type: DataTypes.INTEGER, allowNull: false },
  programado_para: { type: DataTypes.DATE, allowNull: false },
  estado: { type: DataTypes.ENUM('pendiente', 'enviando', 'enviado', 'omitido', 'fallido'), allowNull: false, defaultValue: 'pendiente' },
  enviado_en: { type: DataTypes.DATE, allowNull: true },
  intentos: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  ultimo_error: { type: DataTypes.TEXT, allowNull: true }
}, {
  tableName: 'eventos_recordatorios',
  timestamps: true,
  underscored: true,
  indexes: [
    { unique: true, fields: ['evento_id', 'offset_minutos'], name: 'uq_evento_offset' },
    { fields: ['estado', 'programado_para'], name: 'idx_estado_programado' }
  ]
});

EventoRecordatorio.OFFSETS_MINUTOS = [
  14 * 24 * 60,
  7 * 24 * 60,
  4 * 24 * 60,
  2 * 24 * 60,
  1 * 24 * 60,
  12 * 60,
  60
];

EventoRecordatorio.associate = (models) => {
  EventoRecordatorio.belongsTo(models.EventoCalendario, { foreignKey: 'evento_id', as: 'evento', onDelete: 'CASCADE' });
};

module.exports = EventoRecordatorio;
