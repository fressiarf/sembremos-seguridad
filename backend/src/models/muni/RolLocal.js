const { DataTypes } = require('sequelize');
const { sequelizeMUNI } = require('../../config/database');

const RolLocal = sequelizeMUNI.define('RolLocal', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  permisos: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  tableName: 'roles_local',
  timestamps: false,
  underscored: true
});

RolLocal.associate = (models) => {
  RolLocal.hasMany(models.UsuarioLocal, { foreignKey: 'rol_id', as: 'usuarios' });
};

module.exports = RolLocal;
