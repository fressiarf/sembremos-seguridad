const { DataTypes } = require('sequelize');
const { sequelizeFP } = require('../../config/database');

const LogAuditoriaFP = sequelizeFP.define('LogAuditoriaFP', {
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
  tableName: 'logs_auditoria_fp',
  timestamps: true,
  underscored: true
});

LogAuditoriaFP.associate = (models) => {
  LogAuditoriaFP.belongsTo(models.UsuarioFP, { foreignKey: 'usuario_id', as: 'usuario' });
};

module.exports = LogAuditoriaFP;
