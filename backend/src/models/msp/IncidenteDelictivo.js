const { DataTypes } = require('sequelize');
const { sequelizeFP } = require('../../config/database');

const IncidenteDelictivo = sequelizeFP.define('IncidenteDelictivo', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  zona_id: { type: DataTypes.UUID, allowNull: false, references: { model: 'zonas_riesgo', key: 'id' } },
  tipo_delito_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'cat_tipo_delito', key: 'id' } },
  gravedad_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'cat_gravedad', key: 'id' } },
  estado_caso_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'cat_estado_caso', key: 'id' } },
  descripcion: { type: DataTypes.TEXT, allowNull: true },
  coordenada_gps: { type: DataTypes.JSON, allowNull: true },
  fecha_incidente: { type: DataTypes.DATE, allowNull: false }
}, { tableName: 'incidentes_delictivos', timestamps: true, underscored: true });

IncidenteDelictivo.associate = (models) => {
  IncidenteDelictivo.belongsTo(models.ZonaRiesgo, { foreignKey: 'zona_id', as: 'zona' });
  IncidenteDelictivo.belongsTo(models.CatTipoDelito, { foreignKey: 'tipo_delito_id', as: 'tipoDelito' });
  IncidenteDelictivo.belongsTo(models.CatGravedad, { foreignKey: 'gravedad_id', as: 'gravedad' });
  IncidenteDelictivo.belongsTo(models.CatEstadoCaso, { foreignKey: 'estado_caso_id', as: 'estadoCaso' });
};

module.exports = IncidenteDelictivo;
