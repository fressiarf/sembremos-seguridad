const { DataTypes } = require('sequelize');
const { sequelizeFP } = require('../../config/database');
const CatTipoAlerta = sequelizeFP.define('CatTipoAlerta', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false, unique: true }
}, { tableName: 'cat_tipo_alerta', timestamps: false });
module.exports = CatTipoAlerta;
