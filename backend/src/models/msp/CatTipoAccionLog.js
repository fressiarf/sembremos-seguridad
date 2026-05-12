const { DataTypes } = require('sequelize');
const { sequelizeFP } = require('../../config/database');
const CatTipoAccionLog = sequelizeFP.define('CatTipoAccionLog', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false, unique: true }
}, { tableName: 'cat_tipo_accion_log', timestamps: false });
module.exports = CatTipoAccionLog;
