const { DataTypes } = require('sequelize');
const { sequelizeFP } = require('../../config/database');
const CatGravedad = sequelizeFP.define('CatGravedad', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  nivel: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'cat_gravedad', timestamps: false, underscored: true });
module.exports = CatGravedad;
