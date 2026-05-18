const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelizeFP } = require('../../config/database');

const UsuarioFP = sequelizeFP.define('UsuarioFP', {
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
      model: 'roles_fp',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  },
  institucion_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'institucion_maestra',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  ultimo_acceso: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'usuarios_fp',
  timestamps: true,
  underscored: true,
  hooks: {
    beforeValidate: async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 10);
      }
    },
    afterCreate: async (instance, options) => {
      const LogAuditoriaFP = require('./LogAuditoriaFP');
      const { generarHooksAuditoria } = require('../../common/helpers/auditHelper');
      const hooks = generarHooksAuditoria(LogAuditoriaFP, 'UsuarioFP');
      await hooks.afterCreate(instance, options);
    },
    afterUpdate: async (instance, options) => {
      const LogAuditoriaFP = require('./LogAuditoriaFP');
      const { generarHooksAuditoria } = require('../../common/helpers/auditHelper');
      const hooks = generarHooksAuditoria(LogAuditoriaFP, 'UsuarioFP');
      await hooks.afterUpdate(instance, options);
    },
    afterDestroy: async (instance, options) => {
      const LogAuditoriaFP = require('./LogAuditoriaFP');
      const { generarHooksAuditoria } = require('../../common/helpers/auditHelper');
      const hooks = generarHooksAuditoria(LogAuditoriaFP, 'UsuarioFP');
      await hooks.afterDestroy(instance, options);
    }
  }
});

UsuarioFP.associate = (models) => {
  // belongsTo
  UsuarioFP.belongsTo(models.RolFP, { foreignKey: 'rol_id', as: 'rol' });
  UsuarioFP.belongsTo(models.InstitucionMaestra, { foreignKey: 'institucion_id', as: 'institucion' });
  // hasMany (relaciones inversas)
  UsuarioFP.hasMany(models.IncidenteDelictivo, { foreignKey: 'registrado_por', as: 'incidentesRegistrados' });
  UsuarioFP.hasMany(models.InteligenciaTactica, { foreignKey: 'analista_id', as: 'analisis' });
  UsuarioFP.hasMany(models.LineaAccion, { foreignKey: 'responsable_id', as: 'lineasResponsable' });
  UsuarioFP.hasMany(models.SesionActivaFP, { foreignKey: 'usuario_id', as: 'sesiones' });
  UsuarioFP.hasMany(models.LogAuditoriaFP, { foreignKey: 'usuario_id', as: 'logs' });
  UsuarioFP.hasMany(models.NotificacionFP, { foreignKey: 'usuario_id', as: 'notificaciones' });
  UsuarioFP.hasMany(models.CambioPassword, { foreignKey: 'usuario_id', as: 'cambiosPassword' });
  UsuarioFP.hasMany(models.AprobacionReporte, { foreignKey: 'revisor_id', as: 'aprobaciones' });
  UsuarioFP.hasMany(models.DocumentoNacional, { foreignKey: 'publicado_por', as: 'documentos' });
  UsuarioFP.hasMany(models.HistorialIA, { foreignKey: 'usuario_id', as: 'consultasIA' });
};

module.exports = UsuarioFP;
