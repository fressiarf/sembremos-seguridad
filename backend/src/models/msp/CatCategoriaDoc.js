const { DataTypes } = require('sequelize');
const { sequelizeFP } = require('../../config/database');
const CatCategoriaDoc = sequelizeFP.define('CatCategoriaDoc', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(100), allowNull: false, unique: true }
}, { tableName: 'cat_categoria_doc', timestamps: false, underscored: true });
module.exports = CatCategoriaDoc;
