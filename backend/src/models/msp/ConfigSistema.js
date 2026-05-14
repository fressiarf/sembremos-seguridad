const { DataTypes } = require('sequelize');
const { sequelizeFP } = require('../../config/database');

const ConfigSistema = sequelizeFP.define('ConfigSistema', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  clave: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  valor: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  descripcion: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'config_sistema',
  timestamps: false,
  underscored: true
});

module.exports = ConfigSistema;
