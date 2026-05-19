const { DataTypes } = require('sequelize');
const { sequelizeFP } = require('../../config/database');

const LineaAccion = sequelizeFP.define('LineaAccion', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  titulo: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  problematica: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  objetivo_general: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  canton_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'cantones',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  responsable_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'usuarios_fp',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  }
}, {
  tableName: 'lineas_accion',
  timestamps: true,
  underscored: true,
  hooks: {
    afterCreate: async (linea, options) => {
      // Sincronización asíncrona hacia MUNI vía Worker (no bloqueante)
      const syncWorker = require('../../workers/syncWorker');
      syncWorker.addJob('syncLineasAccion');
      // Auditoría automática
      const LogAuditoriaFP = require('./LogAuditoriaFP');
      const { generarHooksAuditoria } = require('../../common/helpers/auditHelper');
      const hooks = generarHooksAuditoria(LogAuditoriaFP, 'LineaAccion');
      await hooks.afterCreate(linea, options);
    },
    afterUpdate: async (linea, options) => {
      // Sincronización asíncrona hacia MUNI vía Worker (no bloqueante)
      const syncWorker = require('../../workers/syncWorker');
      syncWorker.addJob('syncLineasAccion');
      // Auditoría automática
      const LogAuditoriaFP = require('./LogAuditoriaFP');
      const { generarHooksAuditoria } = require('../../common/helpers/auditHelper');
      const hooks = generarHooksAuditoria(LogAuditoriaFP, 'LineaAccion');
      await hooks.afterUpdate(linea, options);
    },
    afterDestroy: async (linea, options) => {
      // Auditoría automática (sin sync porque ya no existe)
      const LogAuditoriaFP = require('./LogAuditoriaFP');
      const { generarHooksAuditoria } = require('../../common/helpers/auditHelper');
      const hooks = generarHooksAuditoria(LogAuditoriaFP, 'LineaAccion');
      await hooks.afterDestroy(linea, options);
    },
    afterUpsert: async (linea, options) => {
      const syncWorker = require('../../workers/syncWorker');
      syncWorker.addJob('syncLineasAccion');
    }
  }
});

LineaAccion.associate = (models) => {
  LineaAccion.belongsTo(models.Canton, { foreignKey: 'canton_id', as: 'canton' });
  LineaAccion.belongsTo(models.UsuarioFP, { foreignKey: 'responsable_id', as: 'responsable' });
  LineaAccion.hasMany(models.AccionEstrategica, { foreignKey: 'linea_id', as: 'acciones' });
  LineaAccion.hasMany(models.AlertaCumplimiento, { foreignKey: 'linea_id', as: 'alertas' });
};

module.exports = LineaAccion;
