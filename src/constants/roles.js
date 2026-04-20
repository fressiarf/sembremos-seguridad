export const ROLES = {
  SUPER_ADMIN: 'admin', // Fuerza Pública: Control total + CRUD
  SUB_ADMIN: 'municipalidad', // Municipalidad: Acceso preventivo, no ve delitos
  ADMIN_INSTITUCION: 'adminInstitucion', // Admin Institucional: Gestiona institución y editores
  EDITOR: 'editor' // Funcionario Operativo: Carga evidencia y reportes (Antiguo 'oficial')
};

// Arreglos de apoyo para validación de rutas
export const ROLE_GROUPS = {
  TODOS_ADMINS: [ROLES.SUPER_ADMIN, ROLES.SUB_ADMIN, ROLES.ADMIN_INSTITUCION],
  EJECUTORES: [ROLES.ADMIN_INSTITUCION, ROLES.EDITOR]
};
