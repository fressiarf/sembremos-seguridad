const { DataTypes } = require('sequelize');
const { sequelizeFP } = require('../../config/database');
const CatVeredicto = sequelizeFP.define('CatVeredicto', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false, unique: true }
}, { tableName: 'cat_veredicto', timestamps: true, underscored: true });
CatVeredicto.associate = (models) => {
  CatVeredicto.hasMany(models.AprobacionReporte, { foreignKey: 'veredicto_id', as: 'aprobaciones' });
};

module.exports = CatVeredicto;
