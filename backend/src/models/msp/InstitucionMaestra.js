const { DataTypes } = require('sequelize');
const { sequelizeFP } = require('../../config/database');

const InstitucionMaestra = sequelizeFP.define('InstitucionMaestra', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  nombre: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  siglas: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  tipo_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'cat_tipo_institucion',
      key: 'id'
    }
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
    tableName: 'institucion_maestra',
  timestamps: true,
  underscored: true,
  hooks: {
    afterCreate: async (instance, options) => {
      try {
        const InstitucionLocal = require('../muni/InstitucionLocal');
        await InstitucionLocal.upsert({
          id: instance.id,
          nombre: instance.nombre,
          siglas: instance.siglas || null,
          activa: true
        });
      } catch (err) {
        console.error('[SYNC ERROR] Auto-sync InstitucionLocal falló:', err.message);
      }
    },
    afterUpdate: async (instance, options) => {
      try {
        const InstitucionLocal = require('../muni/InstitucionLocal');
        await InstitucionLocal.upsert({
          id: instance.id,
          nombre: instance.nombre,
          siglas: instance.siglas || null,
          activa: true
        });
      } catch (err) {
        console.error('[SYNC ERROR] Auto-sync InstitucionLocal falló:', err.message);
      }
    }
  }
});

InstitucionMaestra.associate = (models) => {
  InstitucionMaestra.belongsTo(models.CatTipoInstitucion, { foreignKey: 'tipo_id', as: 'tipo' });
  InstitucionMaestra.belongsTo(models.Canton, { foreignKey: 'canton_id', as: 'canton' });
  InstitucionMaestra.hasMany(models.UsuarioFP, { foreignKey: 'institucion_id', as: 'usuarios' });
};

module.exports = InstitucionMaestra;
