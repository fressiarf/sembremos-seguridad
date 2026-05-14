const { DataTypes } = require('sequelize');
const { sequelizeFP } = require('../../config/database');

const ZonaRiesgo = sequelizeFP.define('ZonaRiesgo', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  nombre: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  coordenadas: {
    type: DataTypes.JSON,
    allowNull: true
  },
  nivel_riesgo_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'cat_nivel_riesgo',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  }
}, {
  tableName: 'zonas_riesgo',
  timestamps: true,
  underscored: true
});

ZonaRiesgo.associate = (models) => {
  ZonaRiesgo.belongsTo(models.CatNivelRiesgo, { foreignKey: 'nivel_riesgo_id', as: 'nivelRiesgo' });
  ZonaRiesgo.hasMany(models.DistribucionPolicial, { foreignKey: 'zona_id', as: 'distribuciones' });
};

module.exports = ZonaRiesgo;
