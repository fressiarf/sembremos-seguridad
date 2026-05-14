const { DataTypes } = require('sequelize');
const { sequelizeMUNI } = require('../../config/database');

const CatEstadoInforme = sequelizeMUNI.define('CatEstadoInforme', {
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
  tableName: 'cat_estado_informe',
  timestamps: false,
  underscored: true
});

module.exports = CatEstadoInforme;
