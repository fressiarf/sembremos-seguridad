const { DataTypes } = require('sequelize');
const { sequelizeFP } = require('../../config/database');

const LineaAccion = sequelizeFP.define('LineaAccion', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  titulo: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  problematica: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  objetivo_general: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  canton_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'cantones',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  responsable_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'usuarios_fp',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  }
}, {
  tableName: 'lineas_accion',
  timestamps: true,
  underscored: true,
  hooks: {
    afterCreate: async (linea, options) => {
      const SyncService = require('../../services/SyncService');
      await SyncService.syncLineasAccion().catch(err => console.error('Error en sync automático:', err));
    },
    afterUpdate: async (linea, options) => {
      const SyncService = require('../../services/SyncService');
      await SyncService.syncLineasAccion().catch(err => console.error('Error en sync automático:', err));
    },
    afterUpsert: async (linea, options) => {
      const SyncService = require('../../services/SyncService');
      await SyncService.syncLineasAccion().catch(err => console.error('Error en sync automático:', err));
    }
  }
});

LineaAccion.associate = (models) => {
  LineaAccion.belongsTo(models.Canton, { foreignKey: 'canton_id', as: 'canton' });
  LineaAccion.belongsTo(models.UsuarioFP, { foreignKey: 'responsable_id', as: 'responsable' });
  LineaAccion.hasMany(models.AccionEstrategica, { foreignKey: 'linea_id', as: 'acciones' });
};

module.exports = LineaAccion;
