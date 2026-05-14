const { DataTypes } = require('sequelize');
const { sequelizeFP } = require('../../config/database');
const CatEstadoCaso = sequelizeFP.define('CatEstadoCaso', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false, unique: true }
}, { tableName: 'cat_estado_caso', timestamps: true, underscored: true });

CatEstadoCaso.associate = (models) => {
  CatEstadoCaso.hasMany(models.IncidenteDelictivo, { foreignKey: 'estado_caso_id', as: 'incidentes' });
};

module.exports = CatEstadoCaso;
