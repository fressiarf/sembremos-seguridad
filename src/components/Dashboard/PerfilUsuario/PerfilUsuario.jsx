import React, { useState, useEffect } from 'react';
import './PerfilUsuario.css';
import { userService } from '../../../services/userService';
import { useToast } from '../../../context/ToastContext';


const Icon = {
  User: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Mail: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  Shield: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  IdCard: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" /><line x1="7" y1="8" x2="17" y2="8" /><line x1="7" y1="12" x2="17" y2="12" /><line x1="7" y1="16" x2="13" y2="16" />
    </svg>
  ),
  Calendar: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Edit: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  Save: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
    </svg>
  )
};

const PerfilUsuario = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    usuario: '',
    cedula: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();


  // ID fijo para demostración (C. Araya)
  const LOGGED_USER_ID = "1";

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const users = await userService.getUsers();
      const currentUser = users.find(u => u.id === LOGGED_USER_ID);
      if (currentUser) {
        setUser(currentUser);
        setFormData({
          nombre: currentUser.nombre,
          usuario: currentUser.usuario,
          cedula: currentUser.cedula
        });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updatedUser = await userService.updateUser(LOGGED_USER_ID, formData);
      setUser(updatedUser);
      setIsEditing(false);
      showToast('Perfil institucional actualizado con éxito', 'success');
    } catch (error) {
      showToast('Error al procesar la actualización del perfil', 'error');
    } finally {

      setSaving(false);
    }
  };

  if (loading) return <div className="perfil-loading">Cargando datos institucionales...</div>;
  if (!user) return <div className="perfil-error">Error: No se encontró el perfil de usuario.</div>;

  return (
    <div className="perfil-usuario">
      <header className="perfil-header">
        <div className="perfil-header__banner"></div>
        <div className="perfil-header__info">
          <div className="perfil-avatar">
            <Icon.User />
          </div>
          <div className="perfil-meta">
            <h1>{user.nombre}</h1>
            <div className="perfil-actions-header">
              <span className={`badge-rol badge-rol--${user.rol}`}>
                {user.rol === 'admin' ? 'Administrador del Sistema' : 'Oficial de Seguridad'}
              </span>
              {!isEditing && (
                <button className="btn-edit-profile" onClick={() => setIsEditing(true)}>
                  <Icon.Edit /> Editar Perfil
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="perfil-content">
        <section className="perfil-section">
          <div className="perfil-card">
            <h3 className="perfil-card__title">Información del Funcionario</h3>
            
            {isEditing ? (
              <form onSubmit={handleUpdate} className="perfil-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Nombre Completo</label>
                    <input 
                      type="text" 
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Correo Institucional</label>
                    <input 
                      type="email" 
                      name="usuario"
                      value={formData.usuario}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Cédula de Identidad</label>
                    <input 
                      type="text" 
                      name="cedula"
                      value={formData.cedula}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-save" disabled={saving}>
                    {saving ? 'Guardando...' : <><Icon.Save /> Guardar Cambios</>}
                  </button>
                </div>
              </form>
            ) : (
              <div className="perfil-grid">
                <div className="perfil-field">
                  <div className="field-icon"><Icon.Mail /></div>
                  <div className="field-data">
                    <label>Correo Electrónico</label>
                    <span>{user.usuario}</span>
                  </div>
                </div>
                <div className="perfil-field">
                  <div className="field-icon"><Icon.IdCard /></div>
                  <div className="field-data">
                    <label>Cédula de Identidad</label>
                    <span>{user.cedula}</span>
                  </div>
                </div>
                <div className="perfil-field">
                  <div className="field-icon"><Icon.Shield /></div>
                  <div className="field-data">
                    <label>Departamento</label>
                    <span>Seguridad Ciudadana - Puntarenas</span>
                  </div>
                </div>
                <div className="perfil-field">
                  <div className="field-icon"><Icon.Calendar /></div>
                  <div className="field-data">
                    <label>Miembro desde</label>
                    <span>14 Marzo, 2025</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <aside className="perfil-sidebar">
          <div className="perfil-card stat-perfil">
            <h4 className="perfil-card__subtitle">Actividad Reciente</h4>
            <div className="perfil-mini-stat">
              <span className="stat-label">Último Acceso</span>
              <span className="stat-val">Hoy, 21:15</span>
            </div>
            <div className="perfil-mini-stat">
              <span className="stat-label">Estado de Cuenta</span>
              <span className="stat-val active-status">Activa</span>
            </div>
          </div>

          <div className="perfil-card help-card">
            <h4>Seguridad Institucional</h4>
            <p>Sus datos están protegidos bajo protocolos de seguridad gubernamental.</p>
            <button className="btn-secondary-inst">Política de Privacidad</button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PerfilUsuario;

