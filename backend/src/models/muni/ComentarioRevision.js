const { DataTypes } = require('sequelize');
const { sequelizeMUNI } = require('../../config/database');

const ComentarioRevision = sequelizeMUNI.define('ComentarioRevision', {
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
  autor_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'usuarios_local', key: 'id' }
  },
  tipo_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'cat_tipo_comentario', key: 'id' }
  },
  contenido: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'comentarios_revision',
  timestamps: true,
  underscored: true
});

ComentarioRevision.associate = (models) => {
  ComentarioRevision.belongsTo(models.ReporteEvidencia, { foreignKey: 'reporte_id', as: 'reporte' });
  ComentarioRevision.belongsTo(models.UsuarioLocal, { foreignKey: 'autor_id', as: 'autor' });
  ComentarioRevision.belongsTo(models.CatTipoComentario, { foreignKey: 'tipo_id', as: 'tipo' });
};

module.exports = ComentarioRevision;
