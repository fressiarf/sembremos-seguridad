const { DataTypes } = require('sequelize');
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
  }
}, {
  tableName: 'usuarios_fp',
  timestamps: true,
  underscored: true
});

UsuarioFP.associate = (models) => {
  UsuarioFP.belongsTo(models.RolFP, { foreignKey: 'rol_id', as: 'rol' });
  UsuarioFP.belongsTo(models.InstitucionMaestra, { foreignKey: 'institucion_id', as: 'institucion' });
};

module.exports = UsuarioFP;
