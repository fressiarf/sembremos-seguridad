'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('asignaciones_cogestor', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4, allowNull: false },
      actividad_id: {
        type: Sequelize.UUID, allowNull: false,
        references: { model: 'actividades_local', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE'
      },
      institucion_id: {
        type: Sequelize.UUID, allowNull: false,
        references: { model: 'instituciones_local', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE'
      },
      usuario_id: {
        type: Sequelize.UUID, allowNull: false,
        references: { model: 'usuarios_local', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE'
      },
      fecha_limite: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  async down(queryInterface) { await queryInterface.dropTable('asignaciones_cogestor'); }
};
