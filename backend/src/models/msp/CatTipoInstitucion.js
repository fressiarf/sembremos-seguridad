const { DataTypes } = require('sequelize');
const { sequelizeFP } = require('../../config/database');

const CatTipoInstitucion = sequelizeFP.define('CatTipoInstitucion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'cat_tipo_institucion',
  timestamps: false,
  underscored: true
});

CatTipoInstitucion.associate = (models) => {
  CatTipoInstitucion.hasMany(models.InstitucionMaestra, { foreignKey: 'tipo_id', as: 'instituciones' });
};

module.exports = CatTipoInstitucion;
