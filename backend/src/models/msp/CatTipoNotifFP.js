const { DataTypes } = require('sequelize');
const { sequelizeFP } = require('../../config/database');
const CatTipoNotifFP = sequelizeFP.define('CatTipoNotifFP', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  icono: { type: DataTypes.STRING(50), allowNull: true }
}, { tableName: 'cat_tipo_notif_fp', timestamps: false });
module.exports = CatTipoNotifFP;
