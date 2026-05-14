const { DataTypes } = require('sequelize');
const { sequelizeFP } = require('../../config/database');

const KpiNacional = sequelizeFP.define('KpiNacional', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  accion_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'acciones_estrategicas',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
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
  tableName: 'kpis_nacionales',
  timestamps: true,
  underscored: true
});

KpiNacional.associate = (models) => {
  KpiNacional.belongsTo(models.AccionEstrategica, { foreignKey: 'accion_id', as: 'accion' });
};

module.exports = KpiNacional;
