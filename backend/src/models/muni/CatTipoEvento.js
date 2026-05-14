const { DataTypes } = require('sequelize');
const { sequelizeMUNI } = require('../../config/database');
const CatTipoEvento = sequelizeMUNI.define('CatTipoEvento', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false, unique: true }
}, { tableName: 'cat_tipo_evento', timestamps: true, underscored: true });
module.exports = CatTipoEvento;
