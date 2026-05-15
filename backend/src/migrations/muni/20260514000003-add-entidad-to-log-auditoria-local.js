'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('logs_auditoria_local', 'entidad', {
      type: Sequelize.STRING(100),
      allowNull: true,
      comment: 'Nombre de la tabla o modelo afectado (ej: actividades_local, informes_d71)'
    });

    await queryInterface.addColumn('logs_auditoria_local', 'entidad_id', {
      type: Sequelize.STRING(36),
      allowNull: true,
      comment: 'ID (UUID o INT) del registro específico que fue modificado'
    });

    await queryInterface.addIndex('logs_auditoria_local', ['entidad', 'entidad_id'], {
      name: 'idx_audit_local_entidad_registro'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('logs_auditoria_local', 'idx_audit_local_entidad_registro');
    await queryInterface.removeColumn('logs_auditoria_local', 'entidad_id');
    await queryInterface.removeColumn('logs_auditoria_local', 'entidad');
  }
};
