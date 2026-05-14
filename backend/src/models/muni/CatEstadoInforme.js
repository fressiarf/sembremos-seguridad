const { DataTypes } = require('sequelize');
const { sequelizeMUNI } = require('../../config/database');

const CatEstadoInforme = sequelizeMUNI.define('CatEstadoInforme', {
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
  tableName: 'cat_estado_informe',
  timestamps: true,
  underscored: true
});

CatEstadoInforme.associate = (models) => {
  CatEstadoInforme.hasMany(models.InformeD71, { foreignKey: 'estado_id', as: 'informes' });
};

module.exports = CatEstadoInforme;
