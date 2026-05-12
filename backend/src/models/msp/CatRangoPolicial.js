const { DataTypes } = require('sequelize');
const { sequelizeFP } = require('../../config/database');

const CatRangoPolicial = sequelizeFP.define('CatRangoPolicial', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  nivel_jerarquico: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'cat_rango_policial',
  timestamps: false
});

module.exports = CatRangoPolicial;
