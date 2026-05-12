const { DataTypes } = require('sequelize');
const { sequelizeMUNI } = require('../../config/database');

const NotificacionLocal = sequelizeMUNI.define('NotificacionLocal', {
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
  titulo: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  mensaje: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  leida: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'notificaciones_local',
  timestamps: true,
  underscored: true
});

NotificacionLocal.associate = (models) => {
  NotificacionLocal.belongsTo(models.UsuarioLocal, { foreignKey: 'usuario_id', as: 'usuario' });
};

module.exports = NotificacionLocal;
