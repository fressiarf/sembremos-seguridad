const { DataTypes } = require('sequelize');
const { sequelizeMUNI } = require('../../config/database');

const LineaAccionSync = sequelizeMUNI.define('LineaAccionSync', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true
  },
  titulo: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  problematica: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  objetivo_general: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'lineas_accion_sync',
  timestamps: true,
  underscored: true
});

LineaAccionSync.associate = (models) => {
  LineaAccionSync.hasMany(models.ActividadLocal, { foreignKey: 'linea_sync_id', as: 'actividades' });
};

module.exports = LineaAccionSync;
