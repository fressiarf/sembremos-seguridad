const { DataTypes } = require('sequelize');
const { sequelizeMUNI } = require('../../config/database');

const CatFuenteFondos = sequelizeMUNI.define('CatFuenteFondos', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'cat_fuente_fondos',
  timestamps: false
});

module.exports = CatFuenteFondos;
