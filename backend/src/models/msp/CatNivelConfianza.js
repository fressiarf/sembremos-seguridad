const { DataTypes } = require('sequelize');
const { sequelizeFP } = require('../../config/database');
const CatNivelConfianza = sequelizeFP.define('CatNivelConfianza', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false, unique: true }
}, { tableName: 'cat_nivel_confianza', timestamps: false, underscored: true });
module.exports = CatNivelConfianza;
