const { DataTypes } = require('sequelize');
const { sequelizeMUNI } = require('../../config/database');

const HitoActividad = sequelizeMUNI.define('HitoActividad', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  actividad_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'actividades_local',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  nombre_paso: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  completado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'hitos_actividad',
  timestamps: true,
  underscored: true
});

HitoActividad.associate = (models) => {
  HitoActividad.belongsTo(models.ActividadLocal, { foreignKey: 'actividad_id', as: 'actividad' });
};

module.exports = HitoActividad;
