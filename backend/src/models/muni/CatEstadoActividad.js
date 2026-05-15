const { DataTypes } = require('sequelize');
const { sequelizeMUNI } = require('../../config/database');

const CatEstadoActividad = sequelizeMUNI.define('CatEstadoActividad', {
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
  tableName: 'cat_estado_actividad',
  timestamps: true,
  underscored: true
});

CatEstadoActividad.associate = (models) => {
  CatEstadoActividad.hasMany(models.ActividadLocal, { foreignKey: 'estado_id', as: 'actividades' });
};

module.exports = CatEstadoActividad;
