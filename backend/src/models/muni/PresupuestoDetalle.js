const { DataTypes } = require('sequelize');
const { sequelizeMUNI } = require('../../config/database');

const PresupuestoDetalle = sequelizeMUNI.define('PresupuestoDetalle', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  actividad_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'actividades_local',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  concepto: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  monto_ejecutado: {
    type: DataTypes.DECIMAL(14, 2),
    allowNull: false,
    defaultValue: 0
  },
  fuente_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'cat_fuente_fondos',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  }
}, {
  tableName: 'presupuesto_detalle',
  timestamps: true,
  underscored: true
});

PresupuestoDetalle.associate = (models) => {
  PresupuestoDetalle.belongsTo(models.ActividadLocal, { foreignKey: 'actividad_id', as: 'actividad' });
  PresupuestoDetalle.belongsTo(models.CatFuenteFondos, { foreignKey: 'fuente_id', as: 'fuente' });
};

module.exports = PresupuestoDetalle;
