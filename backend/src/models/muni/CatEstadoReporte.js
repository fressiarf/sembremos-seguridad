const { DataTypes } = require('sequelize');
const { sequelizeMUNI } = require('../../config/database');

const CatEstadoReporte = sequelizeMUNI.define('CatEstadoReporte', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'cat_estado_reporte',
  timestamps: true,
  underscored: true
});

CatEstadoReporte.associate = (models) => {
  CatEstadoReporte.hasMany(models.ReporteEvidencia, { foreignKey: 'estado_id', as: 'reportes' });
  CatEstadoReporte.hasMany(models.HistorialEstado, { foreignKey: 'estado_anterior_id', as: 'historialAnterior' });
  CatEstadoReporte.hasMany(models.HistorialEstado, { foreignKey: 'estado_nuevo_id', as: 'historialNuevo' });
};

module.exports = CatEstadoReporte;
