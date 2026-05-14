const { DataTypes } = require('sequelize');
const { sequelizeMUNI } = require('../../config/database');

const CatZonaEjecucion = sequelizeMUNI.define('CatZonaEjecucion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  canton_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'cat_zona_ejecucion',
  timestamps: true,
  underscored: true
});

module.exports = CatZonaEjecucion;
