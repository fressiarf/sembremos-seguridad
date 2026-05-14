const { DataTypes } = require('sequelize');
const { sequelizeFP } = require('../../config/database');

const AccionEstrategica = sequelizeFP.define('AccionEstrategica', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  linea_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'lineas_accion',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  nombre: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  objetivo_especifico: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'acciones_estrategicas',
  timestamps: true,
  underscored: true
});

AccionEstrategica.associate = (models) => {
  AccionEstrategica.belongsTo(models.LineaAccion, { foreignKey: 'linea_id', as: 'linea' });
  AccionEstrategica.hasMany(models.KpiNacional, { foreignKey: 'accion_id', as: 'kpis' });
};

module.exports = AccionEstrategica;
