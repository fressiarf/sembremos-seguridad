const { DataTypes } = require('sequelize');
const { sequelizeFP } = require('../../config/database');

const DocumentoNacional = sequelizeFP.define('DocumentoNacional', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  titulo: { type: DataTypes.STRING(200), allowNull: false },
  categoria_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'cat_categoria_doc', key: 'id' } },
  url_archivo: { type: DataTypes.STRING(500), allowNull: false },
  version: { type: DataTypes.STRING(20), allowNull: true },
  publicado_por: { type: DataTypes.UUID, allowNull: false, references: { model: 'usuarios_fp', key: 'id' } }
}, { tableName: 'documentos_nacionales', timestamps: true, underscored: true });

DocumentoNacional.associate = (models) => {
  DocumentoNacional.belongsTo(models.CatCategoriaDoc, { foreignKey: 'categoria_id', as: 'categoria' });
  DocumentoNacional.belongsTo(models.UsuarioFP, { foreignKey: 'publicado_por', as: 'publicador' });
};

module.exports = DocumentoNacional;
