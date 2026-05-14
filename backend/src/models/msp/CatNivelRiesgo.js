const { DataTypes } = require('sequelize');
const { sequelizeFP } = require('../../config/database');

const CatNivelRiesgo = sequelizeFP.define('CatNivelRiesgo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  color_hex: {
    type: DataTypes.STRING(7),
    allowNull: false
  }
}, {
  tableName: 'cat_nivel_riesgo',
  timestamps: true,
  underscored: true
});

CatNivelRiesgo.associate = (models) => {
  CatNivelRiesgo.hasMany(models.ZonaRiesgo, { foreignKey: 'nivel_riesgo_id', as: 'zonas' });
};

module.exports = CatNivelRiesgo;
