const { DataTypes } = require('sequelize');
const { sequelizeMUNI } = require('../../config/database');

const SoporteTicket = sequelizeMUNI.define('SoporteTicket', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  usuario_id: { type: DataTypes.UUID, allowNull: false, references: { model: 'usuarios_local', key: 'id' } },
  asunto: { type: DataTypes.STRING(200), allowNull: false },
  mensaje: { type: DataTypes.TEXT, allowNull: false },
  prioridad_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'cat_prioridad_ticket', key: 'id' } },
  estado_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'cat_estado_ticket', key: 'id' } },
  fecha_cierre: { type: DataTypes.DATE, allowNull: true }
}, { tableName: 'soporte_tickets', timestamps: true, underscored: true });

SoporteTicket.associate = (models) => {
  SoporteTicket.belongsTo(models.UsuarioLocal, { foreignKey: 'usuario_id', as: 'usuario' });
  SoporteTicket.belongsTo(models.CatPrioridadTicket, { foreignKey: 'prioridad_id', as: 'prioridad' });
  SoporteTicket.belongsTo(models.CatEstadoTicket, { foreignKey: 'estado_id', as: 'estado' });
  SoporteTicket.hasMany(models.RespuestaTicket, { foreignKey: 'ticket_id', as: 'respuestas' });
};

module.exports = SoporteTicket;
