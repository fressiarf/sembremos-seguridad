'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('informes_d71', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4, allowNull: false },
      periodo_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'cat_periodo_trimestral', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
      canton_id: { type: Sequelize.INTEGER, allowNull: true },
      resumen_ejecutivo: { type: Sequelize.TEXT, allowNull: true },
      estado_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'cat_estado_informe', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
      generado_por: { type: Sequelize.UUID, allowNull: false, references: { model: 'usuarios_local', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
      fecha_limite: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  async down(queryInterface) { await queryInterface.dropTable('informes_d71'); }
};
