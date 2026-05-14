const { DataTypes } = require('sequelize');
const { sequelizeFP } = require('../../config/database');
const CatVeredicto = sequelizeFP.define('CatVeredicto', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false, unique: true }
}, { tableName: 'cat_veredicto', timestamps: false, underscored: true });
module.exports = CatVeredicto;
