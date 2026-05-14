const { DataTypes } = require('sequelize');
const { sequelizeMUNI } = require('../../config/database');

const ActividadLocal = sequelizeMUNI.define('ActividadLocal', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  linea_sync_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'lineas_accion_sync',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  titulo: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  descripcion_operativa: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tipo_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'cat_tipo_actividad',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  },
  estado_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'cat_estado_actividad',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  },
  gestor_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'usuarios_local',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  presupuesto_asignado: {
    type: DataTypes.DECIMAL(14, 2),
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'actividades_local',
  timestamps: true,
  underscored: true
});

ActividadLocal.associate = (models) => {
  ActividadLocal.belongsTo(models.LineaAccionSync, { foreignKey: 'linea_sync_id', as: 'lineaSync' });
  ActividadLocal.belongsTo(models.CatTipoActividad, { foreignKey: 'tipo_id', as: 'tipo' });
  ActividadLocal.belongsTo(models.CatEstadoActividad, { foreignKey: 'estado_id', as: 'estado' });
  ActividadLocal.belongsTo(models.UsuarioLocal, { foreignKey: 'gestor_id', as: 'gestor' });
  ActividadLocal.hasMany(models.HitoActividad, { foreignKey: 'actividad_id', as: 'hitos' });
  ActividadLocal.hasMany(models.PresupuestoDetalle, { foreignKey: 'actividad_id', as: 'presupuestos' });
};

module.exports = ActividadLocal;
