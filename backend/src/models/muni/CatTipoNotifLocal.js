const { DataTypes } = require('sequelize');
const { sequelizeMUNI } = require('../../config/database');
const CatTipoNotifLocal = sequelizeMUNI.define('CatTipoNotifLocal', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  icono: { type: DataTypes.STRING(50), allowNull: true }
}, { tableName: 'cat_tipo_notif_local', timestamps: false });
module.exports = CatTipoNotifLocal;
