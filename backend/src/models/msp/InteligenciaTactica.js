const { DataTypes } = require('sequelize');
const { sequelizeFP } = require('../../config/database');

const InteligenciaTactica = sequelizeFP.define('InteligenciaTactica', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  zona_id: { type: DataTypes.UUID, allowNull: false, references: { model: 'zonas_riesgo', key: 'id' } },
  clasificacion_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'cat_clasificacion_intel', key: 'id' } },
  confianza_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'cat_nivel_confianza', key: 'id' } },
  hallazgo: { type: DataTypes.TEXT, allowNull: false },
  fuente: { type: DataTypes.STRING(200), allowNull: true },
  analista_id: { type: DataTypes.UUID, allowNull: false, references: { model: 'usuarios_fp', key: 'id' } }
}, { tableName: 'inteligencia_tactica', timestamps: true, underscored: true });

InteligenciaTactica.associate = (models) => {
  InteligenciaTactica.belongsTo(models.ZonaRiesgo, { foreignKey: 'zona_id', as: 'zona' });
  InteligenciaTactica.belongsTo(models.CatClasificacionIntel, { foreignKey: 'clasificacion_id', as: 'clasificacion' });
  InteligenciaTactica.belongsTo(models.CatNivelConfianza, { foreignKey: 'confianza_id', as: 'confianza' });
  InteligenciaTactica.belongsTo(models.UsuarioFP, { foreignKey: 'analista_id', as: 'analista' });
};

module.exports = InteligenciaTactica;
