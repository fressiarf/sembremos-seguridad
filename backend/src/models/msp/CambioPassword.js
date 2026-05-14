const { DataTypes } = require('sequelize');
const { sequelizeFP } = require('../../config/database');

const CambioPassword = sequelizeFP.define('CambioPassword', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  usuario_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'usuarios_fp', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  solicitado_en: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  aprobado_por: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'usuarios_fp', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  resuelto_en: {
    type: DataTypes.DATE,
    allowNull: true
  },
  estado: {
    type: DataTypes.STRING(30),
    allowNull: false,
    defaultValue: 'pendiente'
  }
}, {
  tableName: 'cambios_password',
  timestamps: true,
  underscored: true
});

CambioPassword.associate = (models) => {
  CambioPassword.belongsTo(models.UsuarioFP, { foreignKey: 'usuario_id', as: 'solicitante' });
  CambioPassword.belongsTo(models.UsuarioFP, { foreignKey: 'aprobado_por', as: 'aprobador' });
};

module.exports = CambioPassword;
