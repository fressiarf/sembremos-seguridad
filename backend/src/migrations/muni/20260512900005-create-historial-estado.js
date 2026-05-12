'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('historial_estado', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4, allowNull: false },
      reporte_id: {
        type: Sequelize.UUID, allowNull: false,
        references: { model: 'reportes_evidencia', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE'
      },
      estado_anterior_id: {
        type: Sequelize.INTEGER, allowNull: true,
        references: { model: 'cat_estado_reporte', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT'
      },
      estado_nuevo_id: {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'cat_estado_reporte', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT'
      },
      cambiado_por: {
        type: Sequelize.UUID, allowNull: false,
        references: { model: 'usuarios_local', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT'
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  async down(queryInterface) { await queryInterface.dropTable('historial_estado'); }
};
