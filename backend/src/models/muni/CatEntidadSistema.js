const { DataTypes } = require('sequelize');
const { sequelizeMUNI } = require('../../config/database');
const CatEntidadSistema = sequelizeMUNI.define('CatEntidadSistema', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(100), allowNull: false, unique: true }
}, { tableName: 'cat_entidad_sistema', timestamps: false, underscored: true });
module.exports = CatEntidadSistema;
