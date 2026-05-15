const { DataTypes } = require('sequelize');
const { sequelizeFP } = require('../../config/database');

const HistorialIA = sequelizeFP.define('HistorialIA', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  usuario_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'usuarios_fp', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  pregunta: { type: DataTypes.TEXT, allowNull: false },
  respuesta: { type: DataTypes.TEXT, allowNull: false },
  modulo: { type: DataTypes.STRING(50), allowNull: true },
  tokens_usados: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 }
}, {
  tableName: 'historial_ia',
  timestamps: true,
  underscored: true
});

HistorialIA.associate = (models) => {
  HistorialIA.belongsTo(models.UsuarioFP, { foreignKey: 'usuario_id', as: 'usuario' });
};

module.exports = HistorialIA;
