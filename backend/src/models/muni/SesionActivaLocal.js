const { DataTypes } = require('sequelize');
const { sequelizeMUNI } = require('../../config/database');

const SesionActivaLocal = sequelizeMUNI.define('SesionActivaLocal', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  usuario_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'usuarios_local',
      key: 'id'
    }
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  expira: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'sesiones_activas_local',
  timestamps: true,
  underscored: true
});

SesionActivaLocal.associate = (models) => {
  SesionActivaLocal.belongsTo(models.UsuarioLocal, { foreignKey: 'usuario_id', as: 'usuario' });
};

module.exports = SesionActivaLocal;
