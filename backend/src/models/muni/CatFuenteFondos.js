const { DataTypes } = require('sequelize');
const { sequelizeMUNI } = require('../../config/database');

const CatFuenteFondos = sequelizeMUNI.define('CatFuenteFondos', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'cat_fuente_fondos',
  timestamps: true,
  underscored: true
});

CatFuenteFondos.associate = (models) => {
  CatFuenteFondos.hasMany(models.PresupuestoDetalle, { foreignKey: 'fuente_id', as: 'presupuestos' });
};

module.exports = CatFuenteFondos;
