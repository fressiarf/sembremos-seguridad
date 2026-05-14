const { DataTypes } = require('sequelize');
const { sequelizeFP } = require('../../config/database');

const CatTipoDelito = sequelizeFP.define('CatTipoDelito', {
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
  categoria: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'cat_tipo_delito',
  timestamps: true,
  underscored: true
});

CatTipoDelito.associate = (models) => {
  CatTipoDelito.hasMany(models.IncidenteDelictivo, { foreignKey: 'tipo_delito_id', as: 'incidentes' });
};

module.exports = CatTipoDelito;
