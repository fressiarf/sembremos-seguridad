const { DataTypes } = require('sequelize');
const { sequelizeFP } = require('../../config/database');

const RolFP = sequelizeFP.define('RolFP', {
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
  permisos: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  tableName: 'roles_fp',
  timestamps: false,
  underscored: true
});

module.exports = RolFP;
