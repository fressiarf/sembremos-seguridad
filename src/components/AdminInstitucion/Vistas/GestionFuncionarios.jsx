import React, { useState, useEffect } from 'react';
import '../../Dashboard/GestionUsuarios/GestionUsuarios.css';
import { userService } from '../../../services/userService';
import { useToast } from '../../../context/ToastContext';
import { useLogin } from '../../../context/LoginContext';
import { Search, UserCog, Shield, UserPlus, X, Key, Mail, Fingerprint, User as UserIcon } from 'lucide-react';

const GestionFuncionarios = () => {
  const { user } = useLogin();
  const { showToast } = useToast();

  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [newUser, setNewUser] = useState({
    nombre: '',
    cedula: '',
    usuario: '',
    password: '',
    rol: 'institucion',
    institucion: user?.institucion || ''
  });

  useEffect(() => {
    fetchFuncionarios();
  }, [user]);

  const fetchFuncionarios = async () => {
    if (!user?.institucion) return;
    try {
      setLoading(true);
      const data = await userService.getUsers();
      // Solo funcionarios (rol: institucion) que pertenecen a MI institución
      const misFuncionarios = data.filter(u =>
        u.rol === 'institucion' && u.institucion === user.institucion
      );
      setFuncionarios(misFuncionarios);
    } catch (error) {
      console.error('Error al cargar funcionarios');
    } finally {
      setLoading(false);
    }
  };

  const handlePromover = async (userId) => {
    setUpdatingId(userId);
    try {
      await userService.updateUserRole(userId, 'adminInstitucion');
      setFuncionarios(prev => prev.filter(u => u.id !== userId));
      showToast('Funcionario promovido a Administrador Institucional', 'success');
    } catch (error) {
      showToast('Error al promover funcionario', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCreateFuncionario = async (e) => {
    e.preventDefault();
    if (!newUser.nombre || !newUser.cedula || !newUser.usuario || !newUser.password) {
      showToast('Por favor completa todos los campos', 'warning');
      return;
    }

    try {
      const payload = {
        ...newUser,
        rol: 'institucion',
        institucion: user.institucion
      };
      await userService.createUser(payload);
      showToast('Funcionario registrado exitosamente', 'success');
      setShowCreateModal(false);
      setNewUser({ nombre: '', cedula: '', usuario: '', password: '', rol: 'institucion', institucion: user?.institucion || '' });
      fetchFuncionarios();
    } catch (error) {
      showToast('Error al registrar funcionario', 'error');
    }
  };

  const filteredFuncionarios = funcionarios.filter(u =>
    u.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.usuario?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.cedula?.includes(searchQuery)
  );

  if (loading) return <div style={{ color: '#7a9cc4', padding: '2rem' }}>Cargando funcionarios...</div>;

  return (
    <div className="gestion-usuarios" style={{ padding: '2rem 2.5rem' }}>

      <header className="gestion-usuarios__header">
        <div className="gestion-usuarios__title">
          <h1>Gestión de Funcionarios</h1>
          <p>Administra los editores y funcionarios asignados a <strong>{user?.institucion}</strong>. Estos usuarios pueden llenar formularios y enviar reportes de avance.</p>
        </div>
      </header>

      <section className="gestion-usuarios__filters">
        <div className="search-wrapper">
          <div className="search-icon">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Buscar funcionario por nombre, correo o cédula..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '55px', boxSizing: 'border-box' }}
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => setSearchQuery('')} title="Limpiar búsqueda">
              <X size={14} />
            </button>
          )}
        </div>
        <button className="btn-create-user" onClick={() => setShowCreateModal(true)}>
          <UserPlus size={18} />
          <span>Nuevo Funcionario</span>
        </button>
      </section>

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="user-modal">
            <div className="user-modal__header">
              <h3>Registrar Funcionario — {user?.institucion}</h3>
              <button className="btn-close-modal" onClick={() => setShowCreateModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateFuncionario} className="user-modal__form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Nombre Completo</label>
                  <div className="input-with-icon">
                    <UserIcon size={16} />
                    <input
                      type="text"
                      placeholder="Ej: María Solano"
                      value={newUser.nombre}
                      onChange={e => setNewUser({ ...newUser, nombre: e.target.value })}
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
                      onChange={e => setNewUser({ ...newUser, cedula: e.target.value })}
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
                      onChange={e => setNewUser({ ...newUser, usuario: e.target.value })}
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
                      onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div style={{ padding: '0 1.5rem 0.5rem', fontSize: '0.8rem', color: '#64748b' }}>
                Este funcionario será asignado automáticamente a <strong>{user?.institucion}</strong> con rol de <strong>Editor</strong>.
              </div>
              <div className="user-modal__footer">
                <button type="button" className="btn-cancel-modal" onClick={() => setShowCreateModal(false)}>Cancelar</button>
                <button type="submit" className="btn-submit-modal">Registrar Funcionario</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {filteredFuncionarios.length > 0 ? (
        <div className="usuarios-table-container">
          <table className="usuarios-table">
            <thead>
              <tr>
                <th>Funcionario</th>
                <th>Cédula</th>
                <th>Rol</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredFuncionarios.map(u => (
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
                  <td>{u.cedula}</td>
                  <td>
                    <span className="role-badge role-badge--institucion">
                      <Shield size={14} style={{ marginRight: '6px' }} />
                      Editor
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn-change-role"
                      onClick={() => handlePromover(u.id)}
                      disabled={updatingId === u.id}
                      title="Promover a Administrador Institucional"
                    >
                      <UserCog size={16} />
                      {updatingId === u.id ? 'Promoviendo...' : 'Promover a Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{
          textAlign: 'center', padding: '4rem 2rem', background: 'rgba(255,255,255,0.05)',
          borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.15)', marginTop: '1rem'
        }}>
          <UserPlus size={48} color="#64748b" style={{ marginBottom: '1rem' }} />
          <h3 style={{ margin: 0, color: '#fff', fontWeight: 600 }}>Sin funcionarios registrados</h3>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginTop: '8px', maxWidth: '400px', marginInline: 'auto' }}>
            Aún no has registrado editores para <strong>{user?.institucion}</strong>. Presiona "Nuevo Funcionario" para comenzar.
          </p>
        </div>
      )}
    </div>
  );
};

export default GestionFuncionarios;
