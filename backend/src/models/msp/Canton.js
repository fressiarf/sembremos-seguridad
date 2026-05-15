const { DataTypes } = require('sequelize');
const { sequelizeFP } = require('../../config/database');

const Canton = sequelizeFP.define('Canton', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  provincia_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'provincias',
      key: 'id'
    }
  }
}, {
  tableName: 'cantones',
  timestamps: true,
  underscored: true
});

Canton.associate = (models) => {
  Canton.belongsTo(models.Provincia, { foreignKey: 'provincia_id', as: 'provincia' });
  Canton.hasMany(models.Distrito, { foreignKey: 'canton_id', as: 'distritos' });
  Canton.hasMany(models.InstitucionMaestra, { foreignKey: 'canton_id', as: 'instituciones' });
  Canton.hasMany(models.LineaAccion, { foreignKey: 'canton_id', as: 'lineasAccion' });
};

module.exports = Canton;
