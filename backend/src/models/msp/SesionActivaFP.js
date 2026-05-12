const { DataTypes } = require('sequelize');
const { sequelizeFP } = require('../../config/database');

const SesionActivaFP = sequelizeFP.define('SesionActivaFP', {
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
  token: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  expira: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'sesiones_activas_fp',
  timestamps: true,
  underscored: true
});

SesionActivaFP.associate = (models) => {
  SesionActivaFP.belongsTo(models.UsuarioFP, { foreignKey: 'usuario_id', as: 'usuario' });
};

module.exports = SesionActivaFP;
