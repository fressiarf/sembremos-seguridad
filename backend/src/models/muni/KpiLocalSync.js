const { DataTypes } = require('sequelize');
const { sequelizeMUNI } = require('../../config/database');

const KpiLocalSync = sequelizeMUNI.define('KpiLocalSync', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    comment: 'Mismo UUID que el KPI original en MSP'
  },
  accion_nombre: {
    type: DataTypes.STRING(200),
    allowNull: false,
    comment: 'Nombre de la acción estratégica origen (desnormalizado para consulta rápida)'
  },
  nombre_indicador: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  valor_meta: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0
  },
  valor_actual: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'kpis_local_sync',
  timestamps: true,
  underscored: true
});

module.exports = KpiLocalSync;
