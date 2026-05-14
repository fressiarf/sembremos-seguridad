const { DataTypes } = require('sequelize');
const { sequelizeFP } = require('../../config/database');

const AlertaCumplimiento = sequelizeFP.define('AlertaCumplimiento', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  linea_id: { type: DataTypes.UUID, allowNull: false, references: { model: 'lineas_accion', key: 'id' } },
  institucion_ref: { type: DataTypes.STRING(150), allowNull: true },
  tipo_alerta_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'cat_tipo_alerta', key: 'id' } },
  prioridad_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'cat_prioridad', key: 'id' } },
  mensaje: { type: DataTypes.TEXT, allowNull: false },
  resuelta: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
}, {
  tableName: 'alertas_cumplimiento',
  timestamps: true,
  underscored: true,
  hooks: {
    afterCreate: async (instance, options) => {
      const LogAuditoriaFP = require('./LogAuditoriaFP');
      const { generarHooksAuditoria } = require('../../common/helpers/auditHelper');
      const hooks = generarHooksAuditoria(LogAuditoriaFP, 'AlertaCumplimiento');
      await hooks.afterCreate(instance, options);
    },
    afterUpdate: async (instance, options) => {
      const LogAuditoriaFP = require('./LogAuditoriaFP');
      const { generarHooksAuditoria } = require('../../common/helpers/auditHelper');
      const hooks = generarHooksAuditoria(LogAuditoriaFP, 'AlertaCumplimiento');
      await hooks.afterUpdate(instance, options);
    },
    afterDestroy: async (instance, options) => {
      const LogAuditoriaFP = require('./LogAuditoriaFP');
      const { generarHooksAuditoria } = require('../../common/helpers/auditHelper');
      const hooks = generarHooksAuditoria(LogAuditoriaFP, 'AlertaCumplimiento');
      await hooks.afterDestroy(instance, options);
    }
  }
});

AlertaCumplimiento.associate = (models) => {
  AlertaCumplimiento.belongsTo(models.LineaAccion, { foreignKey: 'linea_id', as: 'linea' });
  AlertaCumplimiento.belongsTo(models.CatTipoAlerta, { foreignKey: 'tipo_alerta_id', as: 'tipoAlerta' });
  AlertaCumplimiento.belongsTo(models.CatPrioridad, { foreignKey: 'prioridad_id', as: 'prioridad' });
};

module.exports = AlertaCumplimiento;
