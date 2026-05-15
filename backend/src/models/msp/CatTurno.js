const { DataTypes } = require('sequelize');
const { sequelizeFP } = require('../../config/database');

const CatTurno = sequelizeFP.define('CatTurno', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  hora_inicio: {
    type: DataTypes.TIME,
    allowNull: false
  },
  hora_fin: {
    type: DataTypes.TIME,
    allowNull: false
  }
}, {
  tableName: 'cat_turno',
  timestamps: true,
  underscored: true
});

CatTurno.associate = (models) => {
  CatTurno.hasMany(models.DistribucionPolicial, { foreignKey: 'turno_id', as: 'distribuciones' });
};

module.exports = CatTurno;
