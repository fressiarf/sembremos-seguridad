const { DataTypes } = require('sequelize');
const { sequelizeMUNI } = require('../../config/database');

const LogAuditoriaLocal = sequelizeMUNI.define('LogAuditoriaLocal', {
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
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  },
  accion: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  datos_anteriores: {
    type: DataTypes.JSON,
    allowNull: true
  },
  datos_nuevos: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  tableName: 'logs_auditoria_local',
  timestamps: true,
  underscored: true
});

LogAuditoriaLocal.associate = (models) => {
  LogAuditoriaLocal.belongsTo(models.UsuarioLocal, { foreignKey: 'usuario_id', as: 'usuario' });
};

module.exports = LogAuditoriaLocal;
