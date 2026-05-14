const { DataTypes } = require('sequelize');
const { sequelizeFP } = require('../../config/database');

const RolFP = sequelizeFP.define('RolFP', {
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
  tableName: 'roles_fp',
  timestamps: true,
  underscored: true
});

RolFP.associate = (models) => {
  RolFP.hasMany(models.UsuarioFP, { foreignKey: 'rol_id', as: 'usuarios' });
};

module.exports = RolFP;
