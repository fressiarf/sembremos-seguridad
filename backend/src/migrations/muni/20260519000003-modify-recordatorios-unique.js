'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Agregar columna destinatario_email
    await queryInterface.addColumn('eventos_recordatorios', 'destinatario_email', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Correo electrónico del destinatario específico'
    });

    // 2. Eliminar la restricción UNIQUE anterior
    // Si la DB es MySQL/MariaDB y se creó con indexes de Sequelize, el constraint name es uq_evento_offset
    try {
      await queryInterface.removeIndex('eventos_recordatorios', 'uq_evento_offset');
    } catch (err) {
      console.warn('Index uq_evento_offset no encontrado, se intentará el nombre auto-generado por Sequelize');
      try {
        await queryInterface.removeConstraint('eventos_recordatorios', 'eventos_recordatorios_evento_id_offset_minutos_unique');
      } catch (e) {
         console.warn('Constraint unique anterior no encontrado, omitiendo.');
      }
    }

    // 3. Crear nueva restricción UNIQUE (evento_id, offset_minutos, destinatario_email)
    await queryInterface.addIndex('eventos_recordatorios', ['evento_id', 'offset_minutos', 'destinatario_email'], {
      unique: true,
      name: 'uq_evento_offset_email'
    });
  },

  async down(queryInterface, Sequelize) {
    // Revertir cambios
    try {
      await queryInterface.removeIndex('eventos_recordatorios', 'uq_evento_offset_email');
    } catch (e) {}

    await queryInterface.addIndex('eventos_recordatorios', ['evento_id', 'offset_minutos'], {
      unique: true,
      name: 'uq_evento_offset'
    });

    await queryInterface.removeColumn('eventos_recordatorios', 'destinatario_email');
  }
};
