const { DataTypes } = require('sequelize');
const { sequelizeMUNI } = require('../../config/database');

const RespuestaTicket = sequelizeMUNI.define('RespuestaTicket', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  ticket_id: { type: DataTypes.UUID, allowNull: false, references: { model: 'soporte_tickets', key: 'id' } },
  autor_id: { type: DataTypes.UUID, allowNull: false, references: { model: 'usuarios_local', key: 'id' } },
  contenido: { type: DataTypes.TEXT, allowNull: false }
}, { tableName: 'respuestas_ticket', timestamps: true, underscored: true });

RespuestaTicket.associate = (models) => {
  RespuestaTicket.belongsTo(models.SoporteTicket, { foreignKey: 'ticket_id', as: 'ticket' });
  RespuestaTicket.belongsTo(models.UsuarioLocal, { foreignKey: 'autor_id', as: 'autor' });
};

module.exports = RespuestaTicket;
