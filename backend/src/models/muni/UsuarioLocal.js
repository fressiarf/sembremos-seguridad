const { DataTypes } = require('sequelize');
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
  }
}, {
  tableName: 'usuarios_local',
  timestamps: true,
  underscored: true,
  hooks: {
    afterCreate: async (user, options) => {
      try {
        const UsuarioFP = require('../../models/msp/UsuarioFP');
        await UsuarioFP.upsert({
          id: user.id,
          nombre: user.nombre,
          apellido: user.apellido,
          email: user.email,
          password_hash: user.password_hash,
          cedula: user.cedula,
          telefono: user.telefono,
          rol_id: 1, // Por defecto como Rol 1 en MSP (Admin Institucional)
          activo: user.activo
        });
        console.log('✅ Usuario sincronizado con MSP exitosamente');
      } catch (err) {
        console.error('Error sincronizando usuario con MSP:', err.message);
      }
    }
  }
});

UsuarioLocal.associate = (models) => {
  UsuarioLocal.belongsTo(models.RolLocal, { foreignKey: 'rol_id', as: 'rol' });
};

module.exports = UsuarioLocal;
