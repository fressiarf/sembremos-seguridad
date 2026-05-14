const { DataTypes } = require('sequelize');
const { sequelizeMUNI } = require('../../config/database');

const ReporteEvidencia = sequelizeMUNI.define('ReporteEvidencia', {
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
  autor_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'usuarios_local',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  },
  descripcion_logro: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  impacto_comunidad: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  estado_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'cat_estado_reporte',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  }
}, {
  tableName: 'reportes_evidencia',
  timestamps: true,
  underscored: true
});

ReporteEvidencia.associate = (models) => {
  ReporteEvidencia.belongsTo(models.ActividadLocal, { foreignKey: 'actividad_id', as: 'actividad' });
  ReporteEvidencia.belongsTo(models.UsuarioLocal, { foreignKey: 'autor_id', as: 'autor' });
  ReporteEvidencia.belongsTo(models.CatEstadoReporte, { foreignKey: 'estado_id', as: 'estado' });
  ReporteEvidencia.hasMany(models.FotoEvidencia, { foreignKey: 'reporte_id', as: 'fotos' });
  ReporteEvidencia.hasOne(models.DesgloseAsistencia, { foreignKey: 'reporte_id', as: 'asistencia' });
};

module.exports = ReporteEvidencia;
