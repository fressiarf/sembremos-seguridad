const { DataTypes } = require('sequelize');
const { sequelizeFP } = require('../../config/database');

const DistribucionPolicial = sequelizeFP.define('DistribucionPolicial', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  zona_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'zonas_riesgo',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  cantidad_oficiales: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  turno_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'cat_turno',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  }
}, {
  tableName: 'distribucion_policial',
  timestamps: true,
  underscored: true,
  hooks: {
    afterCreate: async (instance, options) => {
      const LogAuditoriaFP = require('./LogAuditoriaFP');
      const { generarHooksAuditoria } = require('../../common/helpers/auditHelper');
      const hooks = generarHooksAuditoria(LogAuditoriaFP, 'DistribucionPolicial');
      await hooks.afterCreate(instance, options);
    },
    afterUpdate: async (instance, options) => {
      const LogAuditoriaFP = require('./LogAuditoriaFP');
      const { generarHooksAuditoria } = require('../../common/helpers/auditHelper');
      const hooks = generarHooksAuditoria(LogAuditoriaFP, 'DistribucionPolicial');
      await hooks.afterUpdate(instance, options);
    },
    afterDestroy: async (instance, options) => {
      const LogAuditoriaFP = require('./LogAuditoriaFP');
      const { generarHooksAuditoria } = require('../../common/helpers/auditHelper');
      const hooks = generarHooksAuditoria(LogAuditoriaFP, 'DistribucionPolicial');
      await hooks.afterDestroy(instance, options);
    }
  }
});

DistribucionPolicial.associate = (models) => {
  DistribucionPolicial.belongsTo(models.ZonaRiesgo, { foreignKey: 'zona_id', as: 'zona' });
  DistribucionPolicial.belongsTo(models.CatTurno, { foreignKey: 'turno_id', as: 'turno' });
};

module.exports = DistribucionPolicial;
