import React, { useState, useEffect } from 'react';
import './GestionUsuarios.css';
import { userService } from '../../../services/userService';
import { useToast } from '../../../context/ToastContext';


// Íconos simplificados
const Icon = {
  Search: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  UserCog: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <circle cx="19" cy="11" r="3" />
      <path d="M19 8v1" /><path d="M19 13v1" /><path d="M21.5 9.5l-.5.5" /><path d="M17 12l-.5.5" />
    </svg>
  ),
  Shield: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
};

const GestionUsuarios = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const { showToast } = useToast();

  
  // En un sistema real, esto vendría del LoginContext
  const currentUser = { nombre: 'C. Araya', rol: 'admin' };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRole = async (userId, currentRol) => {
    if (currentUser.rol !== 'admin') {
        showToast('Acceso denegado: Solo administradores pueden realizar esta acción', 'error');
        return;
    }

    
    const newRol = currentRol === 'admin' ? 'oficial' : 'admin';
    setUpdatingId(userId);

    try {
      await userService.updateUserRole(userId, newRol);
      // Actualizamos solo el usuario modificado en el estado local
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, rol: newRol } : u));
      showToast(`Rol actualizado: El usuario ahora es ${newRol}`, 'success');
    } catch (error) {
      showToast('Error crítico al actualizar el rol en la base de datos', 'error');
    } finally {

      setUpdatingId(null);
    }
  };


  const filteredUsers = users.filter(user => 
    user.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.usuario.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.cedula.includes(searchQuery)
  );

  if (loading) return <div style={{ color: '#7a9cc4', padding: '2rem' }}>Cargando usuarios...</div>;

  return (
    <div className="gestion-usuarios">
      
      <header className="gestion-usuarios__header">
        <div className="gestion-usuarios__title">
          <h1>Gestión de Usuarios</h1>
          <p>Control de acceso y roles para personal administrativo y oficiales</p>
        </div>
      </header>

      <section className="gestion-usuarios__filters">
        <div className="search-wrapper">
          <div className="search-icon">
            <Icon.Search />
          </div>
          <input 
            type="text" 
            placeholder="Buscar por nombre, correo o cédula..." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '55px', boxSizing: 'border-box' }}
          />
          {searchQuery && (
            <button 
              className="search-clear" 
              onClick={() => setSearchQuery('')}
              title="Limpiar búsqueda"
            >
              ✕
            </button>
          )}
        </div>
      </section>


      <div className="usuarios-table-container">
        <table className="usuarios-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Cédula</th>
              <th>Rol</th>
              <th>Fecha Registro</th>
              <th style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>
                  <div className="user-info-cell">
                    <div className="user-avatar-mini">
                      {user.nombre.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="user-details">
                      <span className="user-name">{user.nombre}</span>
                      <span className="user-email">{user.usuario}</span>
                    </div>
                  </div>
                </td>
                <td>{user.cedula}</td>
                <td>
                  <span className={`role-badge role-badge--${user.rol}`}>
                    <Icon.Shield /> 
                    {user.rol === 'admin' ? 'Administrador' : 'Oficial'}
                  </span>
                </td>
                <td style={{ color: '#7a9cc4', fontSize: '0.8rem' }}>14 Mar, 2025</td>
                <td style={{ textAlign: 'right' }}>
                  <button 
                    className="btn-change-role"
                    onClick={() => handleToggleRole(user.id, user.rol)}
                    disabled={updatingId === user.id}
                    title={`Cambiar a ${user.rol === 'admin' ? 'Oficial' : 'Administrador'}`}
                  >
                    <Icon.UserCog />
                    {updatingId === user.id ? 'Actualizando...' : (user.rol === 'admin' ? 'Degradar a Oficial' : 'Hacer Admin')}
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredUsers.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#7a9cc4' }}>
            No se encontraron usuarios que coincidan con la búsqueda.
          </div>
        )}
      </div>

    </div>
  );
};

export default GestionUsuarios;
