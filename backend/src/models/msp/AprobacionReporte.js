const { DataTypes } = require('sequelize');
const { sequelizeFP } = require('../../config/database');

const AprobacionReporte = sequelizeFP.define('AprobacionReporte', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  reporte_externo_ref: { type: DataTypes.STRING(100), allowNull: true },
  revisor_id: { type: DataTypes.UUID, allowNull: false, references: { model: 'usuarios_fp', key: 'id' } },
  veredicto_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'cat_veredicto', key: 'id' } },
  comentario: { type: DataTypes.TEXT, allowNull: true }
}, {
  tableName: 'aprobaciones_reporte',
  timestamps: true,
  underscored: true,
  hooks: {
    afterCreate: async (instance, options) => {
      const LogAuditoriaFP = require('./LogAuditoriaFP');
      const { generarHooksAuditoria } = require('../../common/helpers/auditHelper');
      const hooks = generarHooksAuditoria(LogAuditoriaFP, 'AprobacionReporte');
      await hooks.afterCreate(instance, options);
    },
    afterUpdate: async (instance, options) => {
      const LogAuditoriaFP = require('./LogAuditoriaFP');
      const { generarHooksAuditoria } = require('../../common/helpers/auditHelper');
      const hooks = generarHooksAuditoria(LogAuditoriaFP, 'AprobacionReporte');
      await hooks.afterUpdate(instance, options);
    },
    afterDestroy: async (instance, options) => {
      const LogAuditoriaFP = require('./LogAuditoriaFP');
      const { generarHooksAuditoria } = require('../../common/helpers/auditHelper');
      const hooks = generarHooksAuditoria(LogAuditoriaFP, 'AprobacionReporte');
      await hooks.afterDestroy(instance, options);
    }
  }
});

AprobacionReporte.associate = (models) => {
  AprobacionReporte.belongsTo(models.UsuarioFP, { foreignKey: 'revisor_id', as: 'revisor' });
  AprobacionReporte.belongsTo(models.CatVeredicto, { foreignKey: 'veredicto_id', as: 'veredicto' });
};

module.exports = AprobacionReporte;
