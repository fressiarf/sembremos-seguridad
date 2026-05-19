'use strict';
module.exports = {
  async up(qi, S) {
    await qi.addColumn('usuarios_local', 'institucion_id', {
      type: S.UUID,
      allowNull: true,
      references: { model: 'instituciones_local', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    await qi.addIndex('usuarios_local', ['institucion_id'], { name: 'idx_usuarios_local_institucion' });
  },
  async down(qi) {
    await qi.removeIndex('usuarios_local', 'idx_usuarios_local_institucion');
    await qi.removeColumn('usuarios_local', 'institucion_id');
  }
};
