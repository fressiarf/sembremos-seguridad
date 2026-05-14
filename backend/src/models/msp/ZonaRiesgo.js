const { DataTypes } = require('sequelize');
const { sequelizeFP } = require('../../config/database');

const ZonaRiesgo = sequelizeFP.define('ZonaRiesgo', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  nombre: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  coordenadas: {
    type: DataTypes.JSON,
    allowNull: true
  },
  nivel_riesgo_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'cat_nivel_riesgo',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  }
}, {
  tableName: 'zonas_riesgo',
  timestamps: true,
  underscored: true,
  hooks: {
    afterCreate: async (instance, options) => {
      const LogAuditoriaFP = require('./LogAuditoriaFP');
      const { generarHooksAuditoria } = require('../../common/helpers/auditHelper');
      const hooks = generarHooksAuditoria(LogAuditoriaFP, 'ZonaRiesgo');
      await hooks.afterCreate(instance, options);
    },
    afterUpdate: async (instance, options) => {
      const LogAuditoriaFP = require('./LogAuditoriaFP');
      const { generarHooksAuditoria } = require('../../common/helpers/auditHelper');
      const hooks = generarHooksAuditoria(LogAuditoriaFP, 'ZonaRiesgo');
      await hooks.afterUpdate(instance, options);
    },
    afterDestroy: async (instance, options) => {
      const LogAuditoriaFP = require('./LogAuditoriaFP');
      const { generarHooksAuditoria } = require('../../common/helpers/auditHelper');
      const hooks = generarHooksAuditoria(LogAuditoriaFP, 'ZonaRiesgo');
      await hooks.afterDestroy(instance, options);
    }
  }
});

ZonaRiesgo.associate = (models) => {
  ZonaRiesgo.belongsTo(models.CatNivelRiesgo, { foreignKey: 'nivel_riesgo_id', as: 'nivelRiesgo' });
  ZonaRiesgo.hasMany(models.DistribucionPolicial, { foreignKey: 'zona_id', as: 'distribuciones' });
  ZonaRiesgo.hasMany(models.IncidenteDelictivo, { foreignKey: 'zona_id', as: 'incidentes' });
  ZonaRiesgo.hasMany(models.InteligenciaTactica, { foreignKey: 'zona_id', as: 'inteligencias' });
};

module.exports = ZonaRiesgo;
