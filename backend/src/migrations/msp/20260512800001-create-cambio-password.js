'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cambios_password', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false
      },
      usuario_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'usuarios_fp', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      solicitado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      aprobado_por: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'usuarios_fp', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      resuelto_en: {
        type: Sequelize.DATE,
        allowNull: true
      },
      estado: {
        type: Sequelize.STRING(30),
        allowNull: false,
        defaultValue: 'pendiente'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('cambios_password');
  }
};
