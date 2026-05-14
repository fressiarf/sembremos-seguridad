const { DataTypes } = require('sequelize');
const { sequelizeMUNI } = require('../../config/database');

const CatTipoComentario = sequelizeMUNI.define('CatTipoComentario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'cat_tipo_comentario',
  timestamps: false,
  underscored: true
});

module.exports = CatTipoComentario;
