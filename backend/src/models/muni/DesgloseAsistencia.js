const { DataTypes } = require('sequelize');
const { sequelizeMUNI } = require('../../config/database');

const DesgloseAsistencia = sequelizeMUNI.define('DesgloseAsistencia', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  reporte_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: 'reportes_evidencia',
      key: 'id'
    }
  },
  ninos: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  jovenes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  adultos: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'desglose_asistencia',
  timestamps: true,
  underscored: true
});

DesgloseAsistencia.associate = (models) => {
  DesgloseAsistencia.belongsTo(models.ReporteEvidencia, { foreignKey: 'reporte_id', as: 'reporte' });
};

module.exports = DesgloseAsistencia;
