import React, { useState, useEffect } from 'react';
import './GestionUsuarios.css';
import { userService } from '../../../services/userService';
import { useToast } from '../../../context/ToastContext';
import { Search, UserCog, Shield, UserPlus, X, Key, Mail, Fingerprint, User as UserIcon } from 'lucide-react';

const GestionUsuarios = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({
    nombre: '',
    cedula: '',
    usuario: '',
    password: '',
    rol: 'oficial'
  });
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

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.nombre || !newUser.cedula || !newUser.usuario || !newUser.password) {
      showToast('Por favor completa todos los campos', 'warning');
      return;
    }

    try {
      await userService.createUser(newUser);
      showToast('Usuario creado exitosamente', 'success');
      setShowCreateModal(false);
      setNewUser({
        nombre: '',
        cedula: '',
        usuario: '',
        password: '',
        rol: 'oficial'
      });
      fetchUsers();
    } catch (error) {
      showToast('Error al crear el usuario', 'error');
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
            <Search size={18} />
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
              <X size={14} />
            </button>
          )}
        </div>
        <button className="btn-create-user" onClick={() => setShowCreateModal(true)}>
            <UserPlus size={18} />
            <span>Nuevo Usuario</span>
        </button>
      </section>

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="user-modal">
            <div className="user-modal__header">
              <h3>Registrar Personal</h3>
              <button className="btn-close-modal" onClick={() => setShowCreateModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="user-modal__form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Nombre Completo</label>
                  <div className="input-with-icon">
                    <UserIcon size={16} />
                    <input 
                      type="text" 
                      placeholder="Ej: Juan Pérez" 
                      value={newUser.nombre}
                      onChange={e => setNewUser({...newUser, nombre: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Número de Cédula</label>
                  <div className="input-with-icon">
                    <Fingerprint size={16} />
                    <input 
                      type="text" 
                      placeholder="Ej: 102340567" 
                      value={newUser.cedula}
                      onChange={e => setNewUser({...newUser, cedula: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Correo Electrónico (Gmail)</label>
                  <div className="input-with-icon">
                    <Mail size={16} />
                    <input 
                      type="email" 
                      placeholder="usuario@gmail.com" 
                      value={newUser.usuario}
                      onChange={e => setNewUser({...newUser, usuario: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Contraseña Temporal</label>
                  <div className="input-with-icon">
                    <Key size={16} />
                    <input 
                      type="password" 
                      placeholder="********" 
                      value={newUser.password}
                      onChange={e => setNewUser({...newUser, password: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-group full-width">
                  <label>Rol asignado</label>
                  <select 
                    value={newUser.rol}
                    onChange={e => setNewUser({...newUser, rol: e.target.value})}
                    className="modal-select"
                  >
                    <option value="oficial">Oficial de campo</option>
                    <option value="admin">Administrador del sistema</option>
                    <option value="analista">Analista de datos</option>
                  </select>
                </div>
              </div>
              <div className="user-modal__footer">
                <button type="button" className="btn-cancel-modal" onClick={() => setShowCreateModal(false)}>Cancelar</button>
                <button type="submit" className="btn-submit-modal">Guardar Usuario</button>
              </div>
            </form>
          </div>
        </div>
      )}


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
                    <Shield size={14} style={{ marginRight: '6px' }} /> 
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
                    <UserCog size={16} />
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
