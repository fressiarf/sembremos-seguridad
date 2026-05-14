const { DataTypes } = require('sequelize');
const { sequelizeMUNI } = require('../../config/database');
const CatPrioridadTicket = sequelizeMUNI.define('CatPrioridadTicket', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  color_hex: { type: DataTypes.STRING(10), allowNull: true }
}, { tableName: 'cat_prioridad_ticket', timestamps: false, underscored: true });
module.exports = CatPrioridadTicket;
