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
    unique: true
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true
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
    }
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'usuarios_local',
  timestamps: true,
  underscored: true
});

UsuarioLocal.associate = (models) => {
  UsuarioLocal.belongsTo(models.RolLocal, { foreignKey: 'rol_id', as: 'rol' });
};

module.exports = UsuarioLocal;
