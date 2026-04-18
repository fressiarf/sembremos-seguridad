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
  const [solicitudes, setSolicitudes] = useState([]);
  const [showSolicitudes, setShowSolicitudes] = useState(false);
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
    fetchSolicitudes();
  }, []);

  const fetchSolicitudes = () => {
    const saved = JSON.parse(localStorage.getItem('solicitudes_acceso') || '[]');
    setSolicitudes(saved);
  };

  const handleDeleteSolicitud = (id) => {
    const updated = solicitudes.filter(s => s.id !== id);
    localStorage.setItem('solicitudes_acceso', JSON.stringify(updated));
    setSolicitudes(updated);
    showToast('Solicitud removida de la lista', 'info');
  };

  const handleResetPassword = async (sol) => {
    // 1. Buscar el usuario correspondiente al correo de la solicitud
    const foundUser = users.find(u => u.usuario.toLowerCase() === sol.correo.toLowerCase());
    
    if (!foundUser) {
      showToast(`No se encontró ningún usuario con el correo: ${sol.correo}`, 'error');
      return;
    }

    // 2. Definir una contraseña temporal
    const tempPassword = `Sembremos.${Math.floor(Math.random() * 9000 + 1000)}`;

    try {
      // 3. Actualizar en la base de datos
      await userService.updateUser(foundUser.id, { password: tempPassword });
      
      // 4. Notificar éxito y quitar de la lista
      showToast(`Contraseña restablecida exitosamente para ${foundUser.nombre}. Nueva clave: ${tempPassword}`, 'success', 8000);
      handleDeleteSolicitud(sol.id);
      
      // Actualizar la lista local de usuarios (opcional, pero útil si se muestra la clave en otro sitio)
      setUsers(prev => prev.map(u => u.id === foundUser.id ? { ...u, password: tempPassword } : u));
    } catch (error) {
      showToast('Error técnico al intentar restablecer la contraseña', 'error');
    }
  };

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
    if (newUser.rol === 'admin') {
      if (!newUser.nombre || !newUser.usuario || !newUser.password || !newUser.cedula) {
        showToast('Completa todos los campos del Administrador', 'warning');
        return;
      }
    } else {
      if (!newUser.institucion || !newUser.usuario || !newUser.password) {
        showToast('Selecciona la Institución y completa los datos de acceso para la misma', 'warning');
        return;
      }
    }
    
    // Básicos
    if (!newUser.nombre || !newUser.cedula || !newUser.usuario || !newUser.password) {
      showToast('Por favor completa todos los campos', 'warning');
      return;
    }

    // Validación de Cédula (numérica)
    if (!/^\d+$/.test(newUser.cedula)) {
      showToast('La cédula debe contener solo números', 'warning');
      return;
    }
    
    if (newUser.cedula.length < 9) {
      showToast('La cédula debe tener al menos 9 dígitos', 'warning');
      return;
    }

    // Validación de Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.usuario)) {
      showToast('Por favor ingresa un correo electrónico válido', 'warning');
      return;
    }

    // Validación de Contraseña
    if (newUser.password.length < 6) {
      showToast('La contraseña debe tener al menos 6 caracteres', 'warning');
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
      <section className="gestion-usuarios__filters" style={{ marginTop: '0' }}>
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
        <div className="header-actions">
          {solicitudes.length > 0 && (
            <button 
              className={`btn-solicitudes ${showSolicitudes ? 'active' : ''}`} 
              onClick={() => setShowSolicitudes(!showSolicitudes)}
            >
              <Mail size={18} />
              <span>Solicitudes ({solicitudes.length})</span>
              <span className="dot-alert"></span>
            </button>
          )}
          {currentUser.rol === 'admin' && (
            <button className="btn-create-user" onClick={() => setShowCreateModal(true)}>
                <UserPlus size={18} />
                <span>Nueva Institución</span>
            </button>
          )}
        </div>
      </section>

      {showSolicitudes && solicitudes.length > 0 && (
        <div className="solicitudes-container animacion-entrada">
          <div className="solicitudes-grid">
            {solicitudes.map(sol => (
              <div key={sol.id} className="solicitud-card">
                <div className="solicitud-info">
                  <div className="solicitud-icon">
                    <Key size={18} />
                  </div>
                  <div>
                    <strong>{sol.correo}</strong>
                    <p>Solicitó reseteo el {sol.fecha}</p>
                  </div>
                </div>
                <div className="solicitud-actions">
                  <button 
                    className="btn-reset-password-mini" 
                    onClick={() => handleResetPassword(sol)}
                    title="Generar nueva clave"
                  >
                    <Key size={14} />
                    <span>Restablecer</span>
                  </button>
                  <button 
                    className="btn-resolve-solicitud" 
                    onClick={() => handleDeleteSolicitud(sol.id)}
                    title="Ignorar / Remover"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
                  <label>Perfil (Tipo de Cuenta)</label>
                  <select 
                    value={newUser.rol}
                    onChange={e => {
                      const newRol = e.target.value;
                      setNewUser({
                        ...newUser, 
                        rol: newRol,
                        nombre: newRol === 'adminInstitucion' ? '' : newUser.nombre,
                        cedula: newRol === 'adminInstitucion' ? '' : newUser.cedula,
                        institucion: newRol === 'admin' ? '' : newUser.institucion
                      });
                    }}
                    className="modal-select"
                  >
                    <option value="adminInstitucion">Institución</option>
                    <option value="admin">Administrador Global</option>
                  </select>
                </div>

                {newUser.rol === 'admin' && (
                  <>
                    <div className="form-group">
                      <label>Nombre del Funcionario *</label>
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
                      <label>Identificación (Cédula) *</label>
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
                  </>
                )}

                {newUser.rol === 'adminInstitucion' && (
                  <>
                    <div className="form-group">
                      <label>Institución a Registrar *</label>
                      <div className="input-with-icon">
                        <Building2 size={16} />
                        <select 
                          value={newUser.institucion}
                          onChange={e => setNewUser({...newUser, institucion: e.target.value, nombre: e.target.value})}
                          className="modal-select"
                          style={{ paddingLeft: '40px' }}
                        >
                          <option value="">Seleccionar institución...</option>
                          {INSTITUCIONES.map(inst => (
                            <option key={inst} value={inst}>{inst}</option>
                          ))}
                        </select>
                      </div>
                      <label>Nombre Completo</label>
                      <div className="input-with-icon">
                        <UserIcon size={16} />
                        <input 
                          type="text" 
                          placeholder="Ej: Juan Pérez" 
                          value={newUser.nombre}
                          onChange={e => {
                            const val = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '');
                            setNewUser({...newUser, nombre: val});
                          }}
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
                          maxLength={12}
                          value={newUser.cedula}
                          onChange={e => {
                            const val = e.target.value.replace(/\D/g, ''); // Solo números
                            setNewUser({...newUser, cedula: val});
                          }}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label>Correo Electrónico *</label>
                  <div className="input-with-icon">
                    <Mail size={16} />
                    <input 
                      type="email" 
                      placeholder="usuario@sembremos.cr" 
                      value={newUser.usuario.toLowerCase().trim()}
                      onKeyDown={(e) => { if (e.key === ' ') e.preventDefault(); }}
                      onChange={e => setNewUser({...newUser, usuario: e.target.value.replace(/\s/g, '').toLowerCase()})}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Contraseña *</label>
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
                <td>{u.cedula || <span style={{ color: '#94a3b8' }}>N/A</span>}</td>
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
