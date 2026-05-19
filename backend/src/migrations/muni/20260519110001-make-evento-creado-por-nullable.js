'use strict';
/**
 * Hace `eventos_calendario.creado_por` nullable + FK con ON DELETE SET NULL.
 *
 * En MySQL hay que alinear charset/collation (CHAR(36) BINARY) con la columna
 * referenciada (`usuarios_local.id` usa utf8mb4_bin). Sin esto, ADD FOREIGN KEY
 * falla con "incompatible columns".
 *
 * También dropeamos cualquier FK previa que apunte a creado_por antes de re-crearla.
 */
module.exports = {
  async up(qi) {
    // 1) Drop FK previas sobre creado_por (si las hay)
    const [rows] = await qi.sequelize.query(`
      SELECT CONSTRAINT_NAME
      FROM information_schema.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'eventos_calendario'
        AND COLUMN_NAME = 'creado_por'
        AND REFERENCED_TABLE_NAME IS NOT NULL
    `);
    for (const r of rows) {
      await qi.sequelize.query(`ALTER TABLE eventos_calendario DROP FOREIGN KEY ${r.CONSTRAINT_NAME}`);
    }

    // 2) Alinear charset/collation con usuarios_local.id (utf8mb4_bin)
    await qi.sequelize.query(`
      ALTER TABLE eventos_calendario
      MODIFY COLUMN creado_por CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL
    `);

    // 3) Re-agregar FK con ON DELETE SET NULL
    await qi.sequelize.query(`
      ALTER TABLE eventos_calendario
      ADD CONSTRAINT eventos_calendario_creado_por_fk
      FOREIGN KEY (creado_por) REFERENCES usuarios_local(id)
      ON UPDATE CASCADE ON DELETE SET NULL
    `);
  },
  async down(qi) {
    const [rows] = await qi.sequelize.query(`
      SELECT CONSTRAINT_NAME
      FROM information_schema.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'eventos_calendario'
        AND COLUMN_NAME = 'creado_por'
        AND REFERENCED_TABLE_NAME IS NOT NULL
    `);
    for (const r of rows) {
      await qi.sequelize.query(`ALTER TABLE eventos_calendario DROP FOREIGN KEY ${r.CONSTRAINT_NAME}`);
    }
    await qi.sequelize.query(`
      ALTER TABLE eventos_calendario
      MODIFY COLUMN creado_por CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL
    `);
    await qi.sequelize.query(`
      ALTER TABLE eventos_calendario
      ADD CONSTRAINT eventos_calendario_creado_por_fk
      FOREIGN KEY (creado_por) REFERENCES usuarios_local(id)
      ON UPDATE CASCADE ON DELETE RESTRICT
    `);
  }
};
