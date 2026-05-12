const { DataTypes } = require('sequelize');
const { sequelizeMUNI } = require('../../config/database');

const FotoEvidencia = sequelizeMUNI.define('FotoEvidencia', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  reporte_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'reportes_evidencia',
      key: 'id'
    }
  },
  url_archivo: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  pie_de_foto: {
    type: DataTypes.STRING(300),
    allowNull: true
  }
}, {
  tableName: 'fotos_evidencia',
  timestamps: true,
  underscored: true
});

FotoEvidencia.associate = (models) => {
  FotoEvidencia.belongsTo(models.ReporteEvidencia, { foreignKey: 'reporte_id', as: 'reporte' });
};

module.exports = FotoEvidencia;
