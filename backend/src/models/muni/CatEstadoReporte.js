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
  timestamps: false
});

module.exports = CatEstadoReporte;
