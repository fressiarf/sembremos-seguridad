const { DataTypes } = require('sequelize');
const { sequelizeFP } = require('../../config/database');
const CatGravedad = sequelizeFP.define('CatGravedad', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  nivel: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'cat_gravedad', timestamps: true, underscored: true });

CatGravedad.associate = (models) => {
  CatGravedad.hasMany(models.IncidenteDelictivo, { foreignKey: 'gravedad_id', as: 'incidentes' });
};

module.exports = CatGravedad;
