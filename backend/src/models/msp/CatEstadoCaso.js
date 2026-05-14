const { DataTypes } = require('sequelize');
const { sequelizeFP } = require('../../config/database');
const CatEstadoCaso = sequelizeFP.define('CatEstadoCaso', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false, unique: true }
}, { tableName: 'cat_estado_caso', timestamps: false, underscored: true });
module.exports = CatEstadoCaso;
