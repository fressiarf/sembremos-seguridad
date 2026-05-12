const { DataTypes } = require('sequelize');
const { sequelizeFP } = require('../../config/database');

const Distrito = sequelizeFP.define('Distrito', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  canton_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'cantones',
      key: 'id'
    }
  }
}, {
  tableName: 'distritos',
  timestamps: true,
  underscored: true
});

Distrito.associate = (models) => {
  Distrito.belongsTo(models.Canton, { foreignKey: 'canton_id', as: 'canton' });
};

module.exports = Distrito;
