const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelizeMUNI } = require('../../config/database');

const UsuarioLocal = sequelizeMUNI.define('UsuarioLocal', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  cedula: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: {
      msg: 'La cédula ya se encuentra registrada'
    },
    validate: {
      is: {
        args: /^[0-9]{9,12}$/,
        msg: 'La cédula debe contener entre 9 y 12 dígitos numéricos'
      }
    }
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: {
      msg: 'El correo electrónico ya se encuentra registrado'
    },
    validate: {
      isEmail: {
        msg: 'Debe proporcionar un formato de correo electrónico válido'
      }
    }
  },
  // Campo VIRTUAL: recibe la contraseña en texto plano para validación
  password: {
    type: DataTypes.VIRTUAL,
    allowNull: true,
    validate: {
      len: {
        args: [8, 50],
        msg: 'La contraseña debe tener entre 8 y 50 caracteres'
      }
    }
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  rol_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'roles_local',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  ultimo_acceso: {
    type: DataTypes.DATE,
    allowNull: true
  },
  recibe_recordatorios: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'usuarios_local',
  timestamps: true,
  underscored: true,
  hooks: {
    beforeValidate: async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 10);
      }
    },
    afterCreate: async (user, options) => {
      // Auditoría automática
      const LogAuditoriaLocal = require('./LogAuditoriaLocal');
      const { generarHooksAuditoria } = require('../../common/helpers/auditHelper');
      const hooks = generarHooksAuditoria(LogAuditoriaLocal, 'UsuarioLocal');
      await hooks.afterCreate(user, options);
    },
    afterUpdate: async (user, options) => {
      const LogAuditoriaLocal = require('./LogAuditoriaLocal');
      const { generarHooksAuditoria } = require('../../common/helpers/auditHelper');
      const hooks = generarHooksAuditoria(LogAuditoriaLocal, 'UsuarioLocal');
      await hooks.afterUpdate(user, options);
    },
    afterDestroy: async (user, options) => {
      const LogAuditoriaLocal = require('./LogAuditoriaLocal');
      const { generarHooksAuditoria } = require('../../common/helpers/auditHelper');
      const hooks = generarHooksAuditoria(LogAuditoriaLocal, 'UsuarioLocal');
      await hooks.afterDestroy(user, options);
    }
  }
});

UsuarioLocal.associate = (models) => {
  // belongsTo
  UsuarioLocal.belongsTo(models.RolLocal, { foreignKey: 'rol_id', as: 'rol' });
  // hasMany (relaciones inversas)
  UsuarioLocal.hasMany(models.ActividadLocal, { foreignKey: 'gestor_id', as: 'actividades' });
  UsuarioLocal.hasMany(models.SoporteTicket, { foreignKey: 'usuario_id', as: 'tickets' });
  UsuarioLocal.hasMany(models.SesionActivaLocal, { foreignKey: 'usuario_id', as: 'sesiones' });
  UsuarioLocal.hasMany(models.LogAuditoriaLocal, { foreignKey: 'usuario_id', as: 'logs' });
  UsuarioLocal.hasMany(models.NotificacionLocal, { foreignKey: 'usuario_id', as: 'notificaciones' });
  UsuarioLocal.hasMany(models.AsignacionCogestor, { foreignKey: 'usuario_id', as: 'cogestiones' });
  UsuarioLocal.hasMany(models.ComentarioRevision, { foreignKey: 'autor_id', as: 'comentarios' });
  UsuarioLocal.hasMany(models.EventoCalendario, { foreignKey: 'creado_por', as: 'eventos' });
  UsuarioLocal.hasMany(models.HistorialEstado, { foreignKey: 'cambiado_por', as: 'cambiosEstado' });
  UsuarioLocal.hasMany(models.HistorialIALocal, { foreignKey: 'usuario_id', as: 'consultasIALocal' });
  UsuarioLocal.hasMany(models.InformeD71, { foreignKey: 'generado_por', as: 'informesGenerados' });
  UsuarioLocal.hasMany(models.ReporteEvidencia, { foreignKey: 'autor_id', as: 'reportesEvidencia' });
  UsuarioLocal.hasMany(models.RespuestaTicket, { foreignKey: 'usuario_id', as: 'respuestasTickets' });
};

module.exports = UsuarioLocal;
