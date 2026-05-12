const { DataTypes } = require('sequelize');
const { sequelizeMUNI } = require('../../config/database');

const InstitucionLocal = sequelizeMUNI.define('InstitucionLocal', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  nombre: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  siglas: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  tipo: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  activa: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'instituciones_local',
  timestamps: true,
  underscored: true
});

module.exports = InstitucionLocal;
