'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('actividades_local', 'gestor_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'usuarios_local',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addIndex('actividades_local', ['gestor_id'], {
      name: 'idx_actividades_gestor'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('actividades_local', 'idx_actividades_gestor');
    await queryInterface.removeColumn('actividades_local', 'gestor_id');
  }
};
