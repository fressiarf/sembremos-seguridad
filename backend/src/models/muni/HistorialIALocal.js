const { DataTypes } = require('sequelize');
const { sequelizeMUNI } = require('../../config/database');

const HistorialIALocal = sequelizeMUNI.define('HistorialIALocal', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  usuario_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'usuarios_local', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  pregunta: { type: DataTypes.TEXT, allowNull: false },
  respuesta: { type: DataTypes.TEXT, allowNull: false },
  modulo: { type: DataTypes.STRING(50), allowNull: true },
  tokens_usados: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 }
}, {
  tableName: 'historial_ia_local',
  timestamps: true,
  underscored: true
});

HistorialIALocal.associate = (models) => {
  HistorialIALocal.belongsTo(models.UsuarioLocal, { foreignKey: 'usuario_id', as: 'usuario' });
};

module.exports = HistorialIALocal;
