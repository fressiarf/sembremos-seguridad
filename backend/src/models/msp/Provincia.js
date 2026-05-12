const { DataTypes } = require('sequelize');
const { sequelizeFP } = require('../../config/database');

const Provincia = sequelizeFP.define('Provincia', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'provincias',
  timestamps: true,
  underscored: true
});

module.exports = Provincia;
