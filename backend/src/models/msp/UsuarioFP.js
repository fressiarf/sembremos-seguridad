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
      model: 'roles_fp',
      key: 'id'
    }
  },
  institucion_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'institucion_maestra',
      key: 'id'
    }
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
