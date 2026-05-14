const { DataTypes } = require('sequelize');
const { sequelizeFP } = require('../../config/database');
const CatPrioridad = sequelizeFP.define('CatPrioridad', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  color_hex: { type: DataTypes.STRING(10), allowNull: true },
  orden: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
}, { tableName: 'cat_prioridad', timestamps: false, underscored: true });
module.exports = CatPrioridad;
