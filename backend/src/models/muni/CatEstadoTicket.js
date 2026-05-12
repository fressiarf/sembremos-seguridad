const { DataTypes } = require('sequelize');
const { sequelizeMUNI } = require('../../config/database');
const CatEstadoTicket = sequelizeMUNI.define('CatEstadoTicket', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false, unique: true }
}, { tableName: 'cat_estado_ticket', timestamps: false });
module.exports = CatEstadoTicket;
