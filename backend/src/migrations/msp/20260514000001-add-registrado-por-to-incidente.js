'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('incidentes_delictivos', 'registrado_por', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'usuarios_fp',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // Índice para optimizar consultas por usuario
    await queryInterface.addIndex('incidentes_delictivos', ['registrado_por'], {
      name: 'idx_incidentes_registrado_por'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('incidentes_delictivos', 'idx_incidentes_registrado_por');
    await queryInterface.removeColumn('incidentes_delictivos', 'registrado_por');
  }
};
