const API_URL = 'http://localhost:5000/usuarios';

export const userService = {
  // Obtener todos los usuarios
  getUsers: async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Actualizar el rol de un usuario
  updateUserRole: async (userId, newRole) => {
    try {
      const response = await fetch(`${API_URL}/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rol: newRole }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error updating role:', error);
      throw error;
    }
  },

  // Actualizar datos del usuario
  updateUser: async (userId, userData) => {
    try {
      const response = await fetch(`${API_URL}/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Crear un nuevo usuario
  createUser: async (userData) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error('Error al crear usuario');
      return await response.json();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Eliminar un usuario
  deleteUser: async (userId) => {
    try {
      const response = await fetch(`${API_URL}/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error al eliminar usuario');
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Restablecer contraseña: genera clave temporal y la persiste
  resetUserPassword: async (userId) => {
    const tempPassword = `Sembremos.${Math.floor(Math.random() * 9000 + 1000)}`;
    try {
      const response = await fetch(`${API_URL}/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: tempPassword }),
      });
      if (!response.ok) throw new Error('Error al restablecer contraseña');
      return tempPassword;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  },

  // Registrar acciones de seguridad
  logSecurityAction: async (logData) => {
    try {
      await fetch('http://localhost:5000/logs_seguridad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...logData,
          timestamp: new Date().toISOString()
        }),
      });
    } catch (error) {
      console.error('Error logging security action:', error);
    }
  },

  // Generar notificación para el administrador institucional
  notifyAdminInstitucion: async (institucion, mensaje) => {
    try {
      await fetch('http://localhost:5000/notificaciones_admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          institucion,
          mensaje,
          leida: false,
          tipo: 'seguridad',
          timestamp: new Date().toISOString()
        }),
      });
    } catch (error) {
      console.error('Error notifying admin:', error);
    }
  }
};
