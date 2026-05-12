'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('incidentes_delictivos', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4, allowNull: false },
      zona_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'zonas_riesgo', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      tipo_delito_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'cat_tipo_delito', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
      gravedad_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'cat_gravedad', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
      estado_caso_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'cat_estado_caso', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
      descripcion: { type: Sequelize.TEXT, allowNull: true },
      coordenada_gps: { type: Sequelize.JSON, allowNull: true },
      fecha_incidente: { type: Sequelize.DATE, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  async down(queryInterface) { await queryInterface.dropTable('incidentes_delictivos'); }
};
