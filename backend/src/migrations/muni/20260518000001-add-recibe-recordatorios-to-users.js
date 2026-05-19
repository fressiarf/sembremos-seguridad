'use strict';
module.exports = {
  async up(qi, S) {
    await qi.addColumn('usuarios_local', 'recibe_recordatorios', {
      type: S.BOOLEAN,
      allowNull: false,
      defaultValue: true
    });
  },
  async down(qi) {
    await qi.removeColumn('usuarios_local', 'recibe_recordatorios');
  }
};
