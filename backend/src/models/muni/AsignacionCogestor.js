const { DataTypes } = require('sequelize');
const { sequelizeMUNI } = require('../../config/database');

const AsignacionCogestor = sequelizeMUNI.define('AsignacionCogestor', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  actividad_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'actividades_local', key: 'id' }
  },
  institucion_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'instituciones_local', key: 'id' }
  },
  usuario_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'usuarios_local', key: 'id' }
  },
  fecha_limite: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'asignaciones_cogestor',
  timestamps: true,
  underscored: true
});

AsignacionCogestor.associate = (models) => {
  AsignacionCogestor.belongsTo(models.ActividadLocal, { foreignKey: 'actividad_id', as: 'actividad' });
  AsignacionCogestor.belongsTo(models.InstitucionLocal, { foreignKey: 'institucion_id', as: 'institucion' });
  AsignacionCogestor.belongsTo(models.UsuarioLocal, { foreignKey: 'usuario_id', as: 'usuario' });
};

module.exports = AsignacionCogestor;
