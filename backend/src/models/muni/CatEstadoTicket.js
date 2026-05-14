const { DataTypes } = require('sequelize');
const { sequelizeMUNI } = require('../../config/database');
const CatEstadoTicket = sequelizeMUNI.define('CatEstadoTicket', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false, unique: true }
}, { tableName: 'cat_estado_ticket', timestamps: true, underscored: true });

CatEstadoTicket.associate = (models) => {
  CatEstadoTicket.hasMany(models.SoporteTicket, { foreignKey: 'estado_id', as: 'tickets' });
};

module.exports = CatEstadoTicket;
