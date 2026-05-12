'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('comentarios_revision', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4, allowNull: false },
      reporte_id: {
        type: Sequelize.UUID, allowNull: false,
        references: { model: 'reportes_evidencia', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE'
      },
      autor_id: {
        type: Sequelize.UUID, allowNull: false,
        references: { model: 'usuarios_local', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT'
      },
      tipo_id: {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'cat_tipo_comentario', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT'
      },
      contenido: { type: Sequelize.TEXT, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  async down(queryInterface) { await queryInterface.dropTable('comentarios_revision'); }
};
