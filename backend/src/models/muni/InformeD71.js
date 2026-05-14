const { DataTypes } = require('sequelize');
const { sequelizeMUNI } = require('../../config/database');

const InformeD71 = sequelizeMUNI.define('InformeD71', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  periodo_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'cat_periodo_trimestral', key: 'id' } },
  canton_id: { type: DataTypes.INTEGER, allowNull: true },
  resumen_ejecutivo: { type: DataTypes.TEXT, allowNull: true },
  estado_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'cat_estado_informe', key: 'id' } },
  generado_por: { type: DataTypes.UUID, allowNull: false, references: { model: 'usuarios_local', key: 'id' } },
  fecha_limite: { type: DataTypes.DATE, allowNull: true }
}, {
  tableName: 'informes_d71',
  timestamps: true,
  underscored: true,
  hooks: {
    afterCreate: async (instance, options) => {
      const LogAuditoriaLocal = require('./LogAuditoriaLocal');
      const { generarHooksAuditoria } = require('../../common/helpers/auditHelper');
      const hooks = generarHooksAuditoria(LogAuditoriaLocal, 'InformeD71');
      await hooks.afterCreate(instance, options);
    },
    afterUpdate: async (instance, options) => {
      const LogAuditoriaLocal = require('./LogAuditoriaLocal');
      const { generarHooksAuditoria } = require('../../common/helpers/auditHelper');
      const hooks = generarHooksAuditoria(LogAuditoriaLocal, 'InformeD71');
      await hooks.afterUpdate(instance, options);
    },
    afterDestroy: async (instance, options) => {
      const LogAuditoriaLocal = require('./LogAuditoriaLocal');
      const { generarHooksAuditoria } = require('../../common/helpers/auditHelper');
      const hooks = generarHooksAuditoria(LogAuditoriaLocal, 'InformeD71');
      await hooks.afterDestroy(instance, options);
    }
  }
});

InformeD71.associate = (models) => {
  InformeD71.belongsTo(models.CatPeriodoTrimestral, { foreignKey: 'periodo_id', as: 'periodo' });
  InformeD71.belongsTo(models.CatEstadoInforme, { foreignKey: 'estado_id', as: 'estado' });
  InformeD71.belongsTo(models.UsuarioLocal, { foreignKey: 'generado_por', as: 'generador' });
  InformeD71.hasMany(models.AdjuntoInforme, { foreignKey: 'informe_id', as: 'adjuntos' });
};

module.exports = InformeD71;
