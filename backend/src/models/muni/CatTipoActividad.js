const { DataTypes } = require('sequelize');
const { sequelizeMUNI } = require('../../config/database');

const CatTipoActividad = sequelizeMUNI.define('CatTipoActividad', {
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
  tableName: 'cat_tipo_actividad',
  timestamps: false
});

module.exports = CatTipoActividad;
