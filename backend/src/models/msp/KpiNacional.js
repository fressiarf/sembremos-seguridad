const { DataTypes } = require('sequelize');
const { sequelizeFP } = require('../../config/database');

const KpiNacional = sequelizeFP.define('KpiNacional', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  accion_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'acciones_estrategicas',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  nombre_indicador: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  valor_meta: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0
  },
  valor_actual: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'kpis_nacionales',
  timestamps: true,
  underscored: true,
  hooks: {
    afterCreate: async (instance, options) => {
      const LogAuditoriaFP = require('./LogAuditoriaFP');
      const { generarHooksAuditoria } = require('../../common/helpers/auditHelper');
      const hooks = generarHooksAuditoria(LogAuditoriaFP, 'KpiNacional');
      await hooks.afterCreate(instance, options);
      // Sincronización asíncrona hacia MUNI
      const syncWorker = require('../../workers/syncWorker');
      syncWorker.addJob('syncKpis');
    },
    afterUpdate: async (instance, options) => {
      const LogAuditoriaFP = require('./LogAuditoriaFP');
      const { generarHooksAuditoria } = require('../../common/helpers/auditHelper');
      const hooks = generarHooksAuditoria(LogAuditoriaFP, 'KpiNacional');
      await hooks.afterUpdate(instance, options);
      // Sincronización asíncrona hacia MUNI
      const syncWorker = require('../../workers/syncWorker');
      syncWorker.addJob('syncKpis');
    },
    afterDestroy: async (instance, options) => {
      const LogAuditoriaFP = require('./LogAuditoriaFP');
      const { generarHooksAuditoria } = require('../../common/helpers/auditHelper');
      const hooks = generarHooksAuditoria(LogAuditoriaFP, 'KpiNacional');
      await hooks.afterDestroy(instance, options);
    }
  }
});

KpiNacional.associate = (models) => {
  KpiNacional.belongsTo(models.AccionEstrategica, { foreignKey: 'accion_id', as: 'accion' });
};

module.exports = KpiNacional;
