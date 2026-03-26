import React, { useState, useEffect } from 'react';
import './GestionUsuarios.css';
import { userService } from '../../../services/userService';
import { useToast } from '../../../context/ToastContext';
import { Search, UserCog, Shield, UserPlus, X, Key, Mail, Fingerprint, User as UserIcon, Building2 } from 'lucide-react';
import { useLogin } from '../../../context/LoginContext';

const INSTITUCIONES = [
  'PANI', 'IMAS', 'CCSS', 'MEP', 'IAFA',
  'Ministerio de Salud', 'Bomberos', 'Cruz Roja',
  'Municipalidad de Puntarenas', 'Fuerza Pública', 'INL'
];

const GestionUsuarios = () => {
  const { user } = useLogin();
  const { showToast } = useToast();
  const currentUser = user || { nombre: 'C. Araya', rol: 'admin' };
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [newUser, setNewUser] = useState({
    nombre: '',
    cedula: '',
    usuario: '',
    password: '',
    rol: 'adminInstitucion',
    institucion: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getUsers();
      // Admin global solo ve admins e instituciones, NO funcionarios
      const filtered = data.filter(u => u.rol === 'admin' || u.rol === 'adminInstitucion' || u.rol === 'auditor');
      setUsers(filtered);
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

    const newRol = currentRol === 'admin' ? 'adminInstitucion' : 'admin';
    setUpdatingId(userId);

    try {
      await userService.updateUserRole(userId, newRol);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, rol: newRol } : u));
      showToast(`Rol actualizado: El usuario ahora es ${newRol === 'admin' ? 'Administrador Global' : 'Admin Institución'}`, 'success');
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
    if (newUser.rol === 'adminInstitucion' && !newUser.institucion) {
      showToast('Selecciona una institución para el admin institucional', 'warning');
      return;
    }

    try {
      await userService.createUser(newUser);
      showToast('Usuario creado exitosamente', 'success');
      setShowCreateModal(false);
      setNewUser({ nombre: '', cedula: '', usuario: '', password: '', rol: 'adminInstitucion', institucion: '' });
      fetchUsers();
    } catch (error) {
      showToast('Error al crear el usuario', 'error');
    }
  };

  const getRolLabel = (rol) => {
    switch (rol) {
      case 'admin': return 'Administrador Global';
      case 'adminInstitucion': return 'Admin Institución';
      case 'auditor': return 'Auditor';
      default: return rol;
    }
  };

  const getRolBadgeClass = (rol) => {
    switch (rol) {
      case 'admin': return 'role-badge role-badge--admin';
      case 'adminInstitucion': return 'role-badge role-badge--adminInstitucion';
      case 'auditor': return 'role-badge role-badge--auditor';
      default: return 'role-badge';
    }
  };

  const filteredUsers = users.filter(u =>
    u.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.usuario?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.cedula?.includes(searchQuery) ||
    u.institucion?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div style={{ color: '#7a9cc4', padding: '2rem' }}>Cargando usuarios...</div>;

  return (
    <div className="gestion-usuarios">
      
      <header className="gestion-usuarios__header">
        <div className="gestion-usuarios__title">
          <h1>Gestión de Instituciones y Administradores</h1>
          <p>Control de acceso para administradores globales e institucionales. Los funcionarios internos son gestionados por cada institución.</p>
        </div>
      </header>

      <section className="gestion-usuarios__filters">
        <div className="search-wrapper">
          <div className="search-icon">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Buscar por nombre, correo, cédula o institución..." 
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
        {currentUser.rol === 'admin' && (
          <button className="btn-create-user" onClick={() => setShowCreateModal(true)}>
              <UserPlus size={18} />
              <span>Nueva Institución</span>
          </button>
        )}
      </section>

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="user-modal">
            <div className="user-modal__header">
              <h3>Registrar Administrador / Institución</h3>
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
                  <label>Correo Electrónico</label>
                  <div className="input-with-icon">
                    <Mail size={16} />
                    <input 
                      type="email" 
                      placeholder="usuario@sembremos.cr" 
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
                <div className="form-group">
                  <label>Rol Asignado</label>
                  <select 
                    value={newUser.rol}
                    onChange={e => setNewUser({...newUser, rol: e.target.value})}
                    className="modal-select"
                  >
                    <option value="adminInstitucion">Admin Institución</option>
                    <option value="admin">Administrador Global</option>
                    <option value="auditor">Auditor</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Institución</label>
                  <div className="input-with-icon">
                    <Building2 size={16} />
                    <select 
                      value={newUser.institucion}
                      onChange={e => setNewUser({...newUser, institucion: e.target.value})}
                      className="modal-select"
                      style={{ paddingLeft: '40px' }}
                    >
                      <option value="">Seleccionar institución...</option>
                      {INSTITUCIONES.map(inst => (
                        <option key={inst} value={inst}>{inst}</option>
                      ))}
                    </select>
                  </div>
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
              <th>Institución</th>
              <th>Cédula</th>
              <th>Rol</th>
              <th style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u.id}>
                <td>
                  <div className="user-info-cell">
                    <div className="user-avatar-mini">
                      {u.nombre?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="user-details">
                      <span className="user-name">{u.nombre}</span>
                      <span className="user-email">{u.usuario}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 500 }}>
                    {u.institucion || '—'}
                  </span>
                </td>
                <td>{u.cedula}</td>
                <td>
                  <span className={getRolBadgeClass(u.rol)}>
                    <Shield size={14} style={{ marginRight: '6px' }} /> 
                    {getRolLabel(u.rol)}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  {currentUser.rol === 'admin' && u.id !== currentUser.id ? (
                    <button 
                      className="btn-change-role"
                      onClick={() => handleToggleRole(u.id, u.rol)}
                      disabled={updatingId === u.id}
                      title={`Cambiar a ${u.rol === 'admin' ? 'Admin Institución' : 'Administrador Global'}`}
                    >
                      <UserCog size={16} />
                      {updatingId === u.id ? 'Actualizando...' : (u.rol === 'admin' ? 'Pasar a Institución' : 'Hacer Admin Global')}
                    </button>
                  ) : u.id === currentUser.id ? (
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>Tú</span>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Solo lectura</span>
                  )}
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
