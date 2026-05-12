const { DataTypes } = require('sequelize');
const { sequelizeFP } = require('../../config/database');

const NotificacionFP = sequelizeFP.define('NotificacionFP', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  usuario_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'usuarios_fp',
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
  tableName: 'notificaciones_fp',
  timestamps: true,
  underscored: true
});

NotificacionFP.associate = (models) => {
  NotificacionFP.belongsTo(models.UsuarioFP, { foreignKey: 'usuario_id', as: 'usuario' });
};

module.exports = NotificacionFP;
