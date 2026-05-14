const { DataTypes } = require('sequelize');
const { sequelizeFP } = require('../../config/database');
const CatClasificacionIntel = sequelizeFP.define('CatClasificacionIntel', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  nivel_acceso: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'cat_clasificacion_intel', timestamps: true, underscored: true });
CatClasificacionIntel.associate = (models) => {
  CatClasificacionIntel.hasMany(models.InteligenciaTactica, { foreignKey: 'clasificacion_id', as: 'inteligencias' });
};

module.exports = CatClasificacionIntel;
