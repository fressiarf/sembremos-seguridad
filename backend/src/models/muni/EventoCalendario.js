const { DataTypes } = require('sequelize');
const { sequelizeMUNI } = require('../../config/database');

const EventoCalendario = sequelizeMUNI.define('EventoCalendario', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  titulo: { type: DataTypes.STRING(200), allowNull: false },
  descripcion: { type: DataTypes.TEXT, allowNull: true },
  fecha_inicio: { type: DataTypes.DATE, allowNull: false },
  fecha_fin: { type: DataTypes.DATE, allowNull: true },
  institucion_id: { type: DataTypes.UUID, allowNull: true, references: { model: 'instituciones_local', key: 'id' } },
  creado_por: { type: DataTypes.UUID, allowNull: false, references: { model: 'usuarios_local', key: 'id' } },
  es_publico: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, { tableName: 'eventos_calendario', timestamps: true, underscored: true });

EventoCalendario.associate = (models) => {
  EventoCalendario.belongsTo(models.InstitucionLocal, { foreignKey: 'institucion_id', as: 'institucion' });
  EventoCalendario.belongsTo(models.UsuarioLocal, { foreignKey: 'creado_por', as: 'creador' });
};

module.exports = EventoCalendario;
