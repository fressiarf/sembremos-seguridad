const { DataTypes } = require('sequelize');
const { sequelizeMUNI } = require('../../config/database');

const EventoCalendario = sequelizeMUNI.define('EventoCalendario', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  titulo: { type: DataTypes.STRING(200), allowNull: false },
  descripcion: { type: DataTypes.TEXT, allowNull: true },
  fecha_inicio: { type: DataTypes.DATE, allowNull: false },
  fecha_fin: { type: DataTypes.DATE, allowNull: true },
  institucion_id: { type: DataTypes.UUID, allowNull: true, references: { model: 'instituciones_local', key: 'id' } },
  creado_por: { type: DataTypes.UUID, allowNull: false, references: { model: 'usuarios_local', key: 'id' } },
  es_publico: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, {
  tableName: 'eventos_calendario',
  timestamps: true,
  underscored: true,
  hooks: {
    afterCreate: async (instance, options) => {
      const LogAuditoriaLocal = require('./LogAuditoriaLocal');
      const { generarHooksAuditoria } = require('../../common/helpers/auditHelper');
      const hooks = generarHooksAuditoria(LogAuditoriaLocal, 'EventoCalendario');
      await hooks.afterCreate(instance, options);

      try {
        const { generarRecordatorios } = require('../../services/RecordatorioService');
        await generarRecordatorios(instance.id, instance.fecha_inicio, options);
      } catch (e) {
        console.error(`[RECORDATORIOS] Falló generación para evento ${instance.id}:`, e.message);
      }

      // Confirmación inmediata por correo (no bloquea la respuesta HTTP).
      setImmediate(async () => {
        try {
          const { resolverDestinatariosEvento } = require('../../services/DestinatariosService');
          const { enviarConfirmacion } = require('../../services/MailService');
          const destinatarios = await resolverDestinatariosEvento(instance);
          if (destinatarios.length === 0) {
            console.warn(`[CONFIRMACION] Evento ${instance.id}: sin destinatarios resueltos`);
            return;
          }
          const res = await enviarConfirmacion({ evento: instance, destinatarios });
          if (res && res.skipped) {
            console.warn(`[CONFIRMACION] Evento ${instance.id}: ${res.reason}`);
          } else {
            console.log(`[CONFIRMACION] Evento ${instance.id} -> ${destinatarios.length} destinatario(s)`);
          }
        } catch (e) {
          console.error(`[CONFIRMACION] Falló envío para evento ${instance.id}:`, e.message);
        }
      });
    },
    afterUpdate: async (instance, options) => {
      const LogAuditoriaLocal = require('./LogAuditoriaLocal');
      const { generarHooksAuditoria } = require('../../common/helpers/auditHelper');
      const hooks = generarHooksAuditoria(LogAuditoriaLocal, 'EventoCalendario');
      await hooks.afterUpdate(instance, options);

      if (instance.changed('fecha_inicio')) {
        try {
          const { regenerarRecordatorios } = require('../../services/RecordatorioService');
          await regenerarRecordatorios(instance.id, instance.fecha_inicio, options);
        } catch (e) {
          console.error(`[RECORDATORIOS] Falló regeneración para evento ${instance.id}:`, e.message);
        }
      }
    },
    afterDestroy: async (instance, options) => {
      const LogAuditoriaLocal = require('./LogAuditoriaLocal');
      const { generarHooksAuditoria } = require('../../common/helpers/auditHelper');
      const hooks = generarHooksAuditoria(LogAuditoriaLocal, 'EventoCalendario');
      await hooks.afterDestroy(instance, options);
    }
  }
});

EventoCalendario.associate = (models) => {
  EventoCalendario.belongsTo(models.InstitucionLocal, { foreignKey: 'institucion_id', as: 'institucion' });
  EventoCalendario.belongsTo(models.UsuarioLocal, { foreignKey: 'creado_por', as: 'creador' });
};

module.exports = EventoCalendario;
