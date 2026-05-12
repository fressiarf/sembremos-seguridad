const { DataTypes } = require('sequelize');
const { sequelizeMUNI } = require('../../config/database');

const HistorialEstado = sequelizeMUNI.define('HistorialEstado', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  reporte_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'reportes_evidencia', key: 'id' }
  },
  estado_anterior_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'cat_estado_reporte', key: 'id' }
  },
  estado_nuevo_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'cat_estado_reporte', key: 'id' }
  },
  cambiado_por: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'usuarios_local', key: 'id' }
  }
}, {
  tableName: 'historial_estado',
  timestamps: true,
  underscored: true
});

HistorialEstado.associate = (models) => {
  HistorialEstado.belongsTo(models.ReporteEvidencia, { foreignKey: 'reporte_id', as: 'reporte' });
  HistorialEstado.belongsTo(models.CatEstadoReporte, { foreignKey: 'estado_anterior_id', as: 'estadoAnterior' });
  HistorialEstado.belongsTo(models.CatEstadoReporte, { foreignKey: 'estado_nuevo_id', as: 'estadoNuevo' });
  HistorialEstado.belongsTo(models.UsuarioLocal, { foreignKey: 'cambiado_por', as: 'usuario' });
};

module.exports = HistorialEstado;
