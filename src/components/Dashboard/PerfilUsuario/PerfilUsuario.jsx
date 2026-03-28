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
  const [showPolicy, setShowPolicy] = useState(false);
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
      <div className="perfil-content" style={{ display: 'block' }}>
        <div className="perfil-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          
          {/* HEADER EMBEBIDO EN LA TARJETA */}
          <header className="perfil-header" style={{ marginBottom: 0, borderBottom: '1px solid #e2e8f0', background: 'transparent' }}>
            <div className="perfil-header__banner"></div>
            <div className="perfil-header__info" style={{ maxWidth: 'none', padding: '0 3rem 2.5rem' }}>
              <div className="perfil-avatar">
                <Icon.User />
              </div>
              <div className="perfil-meta">
                <h1>{user.nombre}</h1>
                <div className="perfil-actions-header">
                  <span className={`badge-rol badge-rol--${user.rol}`}>
                    {user.rol === 'admin' ? 'Fuerza Pública (Admin)' : (user.rol === 'municipalidad' ? 'Municipalidad' : (user.rol === 'adminInstitucion' ? 'Administrador Institucional' : 'Editor / Funcionario'))}
                  </span>
                  <button className="btn-edit-profile" onClick={() => setIsEditing(true)}>
                    <Icon.Edit /> Editar Perfil
                  </button>
                </div>
              </div>
            </div>
          </header>          {/* CONTENIDO PRINCIPAL */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', padding: '3rem' }}>
            <section className="perfil-main" style={{ width: '100%' }}>
            <h3 className="perfil-card__title">Información del Funcionario</h3>
            
            {/* Vista Siempre Visible */}
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
            </section>

            <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: 0 }} />

            {/* ACTIVIDAD RECIENTE & SEGURIDAD - EN HORIZONTAL */}
            <section style={{ width: '100%' }}>
              <h3 className="perfil-card__title">Actividad y Seguridad de Cuenta</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem' }}>
                
                <div style={{ flex: '1 1 300px', maxWidth: '450px', padding: '1.5rem', background: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Último Acceso</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0b2240' }}>Hoy, 21:15</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Desde dirección IP Segura</span>
                </div>

                <div style={{ flex: '1 1 300px', maxWidth: '450px', padding: '1.5rem', background: '#f0fdf4', borderRadius: '14px', border: '1px solid #bbf7d0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 600, textTransform: 'uppercase' }}>Estado de Cuenta</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#22c55e' }}>Activa</span>
                  <span style={{ fontSize: '0.75rem', color: '#166534' }}>Verificada y asegurada</span>
                </div>

                <div style={{ flex: '1 1 300px', maxWidth: '450px', padding: '1.5rem', background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Seguridad de Datos</span>
                  <span style={{ fontSize: '0.85rem', color: '#0b2240', marginBottom: '8px', lineHeight: 1.4 }}>Tus datos operan bajo protocolos gubernamentales.</span>
                  <button className="btn-secondary-inst" onClick={() => setShowPolicy(true)} style={{ margin: 0, width: 'auto', padding: '6px 16px', fontSize: '0.8rem', cursor: 'pointer' }}>Política de Privacidad</button>
                </div>

              </div>
            </section>

          </div>
        </div>
      </div>

      {/* OVERLAY MODAL FORM */}
      {isEditing && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.65)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(3px)' }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '3rem', width: '90%', maxWidth: '600px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)', animation: 'fadeIn 0.3s ease' }}>
            <h3 className="perfil-card__title" style={{ marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>Actualización de Perfil</h3>
            <form onSubmit={handleUpdate} className="perfil-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Nombre Completo</label>
                  <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Correo Institucional</label>
                  <input type="email" name="usuario" value={formData.usuario} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Cédula de Identidad</label>
                  <input type="text" name="cedula" value={formData.cedula} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-actions" style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)} style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: 'bold' }}>
                  Cancelar
                </button>
                <button type="submit" className="btn-save" disabled={saving} style={{ background: '#0b2240', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {saving ? 'Guardando...' : <><Icon.Save size={18} /> Guardar Cambios</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    {/* OVERLAY MODAL POLITICA DE PRIVACIDAD */}
      {showPolicy && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.65)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(3px)' }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '3rem', width: '90%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)', animation: 'fadeIn 0.3s ease' }}>
            <h3 className="perfil-card__title" style={{ marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', color: '#0b2240' }}>Protocolo de Seguridad de Datos</h3>
            <div style={{ fontSize: '0.95rem', color: '#334155', lineHeight: '1.7' }}>
              <p style={{ marginBottom: '1.2rem' }}>
                El protocolo de seguridad de la estrategia Sembremos Seguridad en Costa Rica, liderada por el Ministerio de Seguridad Pública (MSP), se fundamenta en la Ley 8968 de Protección de la Persona frente al Tratamiento de sus Datos Personales. Busca proteger la confidencialidad, integridad y uso lícito de la información recopilada en los 84 cantones para prevenir delitos, garantizando la anonimización de datos sensibles y restringiendo el acceso a personal autorizado.
              </p>
              <h4 style={{ color: '#0b2240', marginBottom: '0.8rem', marginTop: '1.5rem', fontSize: '1rem' }}>Los componentes clave de seguridad incluyen:</h4>
              <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <li><strong>Fundamento Legal:</strong> Cumplimiento con la Ley 8968 del Sistema Costarricense de Información Jurídica.</li>
                <li><strong>Gestión de Datos:</strong> Obligación de manejar datos veraces, actuales y pertinentes, con eliminación de datos innecesarios.</li>
                <li><strong>Confidencialidad:</strong> Protección estricta contra el acceso, copia, difusión o tratamiento no autorizado de datos, especialmente los que afecten la intimidad.</li>
                <li><strong>Cooperación Institucional:</strong> Articulación con municipalidades y otras entidades bajo normas de seguridad de la información.</li>
                <li><strong>Transparencia y Rendición de Cuentas:</strong> Publicación de información anonimizada para control ciudadano.</li>
              </ul>
              <div style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: '8px', borderLeft: '4px solid #3b82f6', marginTop: '1.5rem' }}>
                <strong>Nota:</strong> La estrategia se enfoca en el uso de estadísticas y percepciones de seguridad, garantizando que el tratamiento de datos personales no revele información sensible como origen racial, político o salud.
              </div>
            </div>
            <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowPolicy(false)} style={{ background: '#0b2240', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PerfilUsuario;

