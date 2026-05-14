const { DataTypes } = require('sequelize');
const { sequelizeMUNI } = require('../../config/database');

const CatPeriodoTrimestral = sequelizeMUNI.define('CatPeriodoTrimestral', {
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
  mes_inicio: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  mes_fin: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'cat_periodo_trimestral',
  timestamps: false,
  underscored: true
});

module.exports = CatPeriodoTrimestral;
