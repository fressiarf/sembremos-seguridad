'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Columna para identificar la tabla/modelo afectado
    await queryInterface.addColumn('logs_auditoria_fp', 'entidad', {
      type: Sequelize.STRING(100),
      allowNull: true,
      comment: 'Nombre de la tabla o modelo afectado (ej: incidentes_delictivos, lineas_accion)'
    });

    // Columna para identificar el registro específico que cambió
    await queryInterface.addColumn('logs_auditoria_fp', 'entidad_id', {
      type: Sequelize.STRING(36),
      allowNull: true,
      comment: 'ID (UUID o INT) del registro específico que fue modificado'
    });

    // Índice compuesto para consultas rápidas: "¿qué cambios tuvo este registro?"
    await queryInterface.addIndex('logs_auditoria_fp', ['entidad', 'entidad_id'], {
      name: 'idx_audit_fp_entidad_registro'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('logs_auditoria_fp', 'idx_audit_fp_entidad_registro');
    await queryInterface.removeColumn('logs_auditoria_fp', 'entidad_id');
    await queryInterface.removeColumn('logs_auditoria_fp', 'entidad');
  }
};
