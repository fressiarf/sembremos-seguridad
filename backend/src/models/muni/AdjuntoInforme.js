const { DataTypes } = require('sequelize');
const { sequelizeMUNI } = require('../../config/database');

const AdjuntoInforme = sequelizeMUNI.define('AdjuntoInforme', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  informe_id: { type: DataTypes.UUID, allowNull: false, references: { model: 'informes_d71', key: 'id' } },
  nombre_archivo: { type: DataTypes.STRING(200), allowNull: false },
  url_archivo: { type: DataTypes.STRING(500), allowNull: false },
  tipo_mime: { type: DataTypes.STRING(100), allowNull: true }
}, { tableName: 'adjuntos_informe', timestamps: true, underscored: true });

AdjuntoInforme.associate = (models) => {
  AdjuntoInforme.belongsTo(models.InformeD71, { foreignKey: 'informe_id', as: 'informe' });
};

module.exports = AdjuntoInforme;
