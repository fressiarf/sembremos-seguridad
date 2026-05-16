import React, { useState, useEffect } from 'react';
import './GestionUsuarios.css';
import { userService } from '../../../services/userService';
import { useToast } from '../../../context/ToastContext';
import { Search, UserCog, Shield, UserPlus, X, Key, Mail, Fingerprint, User as UserIcon, Building2, Trash2, Zap, Info, Eye, EyeOff, Edit3, CheckCircle, Copy, Clock, ShieldCheck, Lock, Power } from 'lucide-react';
import { useLogin } from '../../../context/LoginContext';
import { apiFetch } from '../../../utils/apiFetch';
import Swal from 'sweetalert2';

const ROLES_POR_NIVEL = {
  MSP: [
    { id: 'admin', label: 'SuperAdmin (MSP)' },
    { id: 'adminInstitucion', label: 'Admin Institucional (MSP)' },
    { id: 'lector', label: 'Lector / Analista (MSP)' }
  ],
  MUNI: [
    { id: 'municipalidad', label: 'Admin Municipal (MUNI)' },
    { id: 'lector', label: 'Lector / Alcaldía (MUNI)' }
  ],
  GESTOR: [
    { id: 'institucion', label: 'Gestor Institucional (Externo)' }
  ]
};

const GestionUsuarios = () => {
  const { user } = useLogin();
  const { showToast } = useToast();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  
  const [showPassword, setShowPassword] = useState(false);
  const [institucionesDB, setInstitucionesDB] = useState([]);
  const [newUser, setNewUser] = useState({
    nombre: '', apellido: '', cedula: '', usuario: '', password: '',
    nivel: 'MSP', rol: 'admin', institucion_id: '', activo: true
  });
  const [confirmPassword, setConfirmPassword] = useState('');

  const [lastCreatedUser, setLastCreatedUser] = useState(null);

  useEffect(() => {
    if (showCreateModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [showCreateModal]);

  useEffect(() => {
    fetchUsers();
    fetchInstituciones();
  }, []);

  const fetchInstituciones = async () => {
    try {
      const response = await apiFetch('/usuarios/catalogos/instituciones');
      if (response.ok) {
        const result = await response.json();
        setInstitucionesDB(result || []);
      }
    } catch (error) {
      console.error('Error fetching instituciones:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getUsers();
      setUsers(data || []);
    } catch (error) {
      console.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const generateSecurePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
    let pass = "SS-";
    for (let i = 0; i < 6; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
    setNewUser({ ...newUser, password: pass });
    setConfirmPassword(pass);
    showToast('Clave generada y confirmada', 'info');
  };

  const handleOpenCreate = () => {
    setIsEditing(false);
    setEditingUserId(null);
    setConfirmPassword('');
    setNewUser({
      nombre: '', apellido: '', cedula: '', usuario: '', password: '',
      nivel: 'MSP', rol: 'admin', institucion_id: '', activo: true
    });
    setShowCreateModal(true);
  };

  const [originalUser, setOriginalUser] = useState(null);

  const handleOpenEdit = (u) => {
    setIsEditing(true);
    setEditingUserId(u.id);
    setOriginalUser(u); // Guardamos para comparar cambios de estado
    setConfirmPassword('');
    setNewUser({
      nombre: u.nombre || '',
      apellido: u.apellido || '',
      cedula: u.cedula || '',
      usuario: u.usuario || u.email || '',
      password: '',
      nivel: u.nivel || 'MSP',
      rol: u.rol || 'admin',
      institucion_id: u.institucion_id || '',
      activo: u.activo === true || u.activo === 1
    });
    setShowCreateModal(true);
  };

  const handleCreateOrUpdateUser = async (e) => {
    if (e) e.preventDefault();
    if (newUser.password !== confirmPassword) {
      showToast('Las contraseñas no coinciden', 'warning');
      return;
    }

    // Validación de seguridad al desactivar desde el formulario
    if (isEditing && originalUser && (originalUser.activo === true || originalUser.activo === 1) && !newUser.activo) {
      const result = await Swal.fire({
        title: '¿Desactivar Funcionario?',
        text: 'Está a punto de quitarle el acceso al sistema a este usuario. ¿Continuar?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Sí, desactivar',
        cancelButtonText: 'Cancelar'
      });
      if (!result.isConfirmed) return;
    }

    try {
      if (isEditing) {
        const payload = { ...newUser, email: newUser.usuario, role: newUser.rol };
        if (!payload.password) delete payload.password;
        await userService.updateUser(editingUserId, payload);
        showToast('Usuario actualizado', 'success');
        setShowCreateModal(false);
      } else {
        await userService.createUser({ ...newUser, email: newUser.usuario, role: newUser.rol });
        setLastCreatedUser({ ...newUser });
        setShowCreateModal(false);
        setShowSuccessModal(true);
      }
      fetchUsers();
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const handleToggleStatus = async (targetUser) => {
    const isActivating = !(targetUser.activo === true || targetUser.activo === 1);
    const actionText = isActivating ? 'ACTIVAR' : 'DESACTIVAR';
    const color = isActivating ? '#22c55e' : '#ef4444';

    const result = await Swal.fire({
      title: `¿${actionText} Usuario?`,
      text: `¿Está seguro de que desea cambiar el acceso para ${targetUser.nombre}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: color,
      confirmButtonText: `Sí, ${actionText}`,
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await userService.updateUser(targetUser.id, { activo: isActivating });
        showToast(`Usuario ${isActivating ? 'activado' : 'desactivado'}`, 'success');
        fetchUsers();
      } catch (error) {
        showToast('Error al cambiar estado', 'error');
      }
    }
  };

  const handleDeleteUser = async (targetUser) => {
    const currentId = user?.id;
    if (targetUser.db_id === currentId || targetUser.id === currentId || targetUser.usuario === user?.email) {
      showToast('No puedes eliminar tu propia cuenta.', 'error');
      return;
    }
    const result = await Swal.fire({
      title: '¿Eliminar Usuario?',
      text: `Esta acción no se puede deshacer. ¿Eliminar a ${targetUser.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;
    try {
      await userService.deleteUser(targetUser.id);
      fetchUsers();
      showToast('Usuario eliminado', 'success');
    } catch (error) {
      showToast('Error al eliminar', 'error');
    }
  };

  const formatLastAccess = (date) => {
    if (!date) return <span style={{ color: '#94a3b8' }}>Nunca ha entrado</span>;
    const d = new Date(date);
    const now = new Date();
    const diff = Math.floor((now - d) / (1000 * 60));
    if (diff >= 0 && diff < 5) {
      return <span style={{ color: '#22c55e', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}><div className="pulse-dot"></div> En línea</span>;
    }
    if (diff < 0) return 'Ahora mismo';
    if (diff < 60) return `Hace ${diff}m`;
    if (diff < 1440) return `Hace ${Math.floor(diff / 60)}h`;
    return d.toLocaleDateString();
  };

  return (
    <div className="gestion-usuarios">
      <div className="gestion-usuarios__filters">
        <div className="search-wrapper">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Buscar funcionario..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <button className="btn-create-user" onClick={handleOpenCreate}>
          <UserPlus size={18} /> Nuevo Registro
        </button>
      </div>

      {showSuccessModal && lastCreatedUser && (
        <div className="modal-overlay">
          <div className="user-modal" style={{ maxWidth: '400px', textAlign: 'center', padding: '30px' }}>
             <CheckCircle size={50} color="#22c55e" style={{ marginBottom: '15px' }} />
             <h3>¡Registro Exitoso!</h3>
             <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '10px', margin: '15px 0', textAlign: 'left' }}>
                <p style={{ margin: '5px 0' }}><strong>Usuario:</strong> {lastCreatedUser.usuario}</p>
                <p style={{ margin: '5px 0' }}><strong>Clave:</strong> <code style={{ color: '#2563eb', fontWeight: 'bold' }}>{lastCreatedUser.password}</code></p>
             </div>
             <button className="btn-submit-modal" style={{ width: '100%' }} onClick={() => setShowSuccessModal(false)}>Aceptar</button>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="user-modal">
            <div className="user-modal__header">
              <h3>{isEditing ? 'Configuración de Funcionario' : 'Registro de Funcionario'}</h3>
              <button className="btn-close-modal" onClick={() => setShowCreateModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateOrUpdateUser} className="user-modal__form">
              <div className="form-grid">
                <div className="type-selector-pills">
                  {['MSP', 'MUNI', 'GESTOR'].map(t => (
                    <button 
                      key={t} type="button" disabled={isEditing}
                      className={`type-pill ${newUser.nivel === t || (t === 'GESTOR' && newUser.rol === 'institucion') ? 'active' : ''}`}
                      onClick={() => {
                        if (t === 'GESTOR') setNewUser({ ...newUser, nivel: 'MUNI', rol: 'institucion', institucion_id: '' });
                        else setNewUser({ ...newUser, nivel: t, rol: t === 'MSP' ? 'admin' : 'municipalidad', institucion_id: '' });
                      }}
                    >
                      {t === 'GESTOR' ? 'Gestor Externo' : (t === 'MSP' ? 'Nivel Nacional' : 'Nivel Local')}
                    </button>
                  ))}
                </div>

                <div className="form-group">
                  <label>Nombre</label>
                  <div className="input-with-icon">
                    <UserIcon size={16} />
                    <input type="text" value={newUser.nombre} onChange={e => setNewUser({...newUser, nombre: e.target.value})} required />
                  </div>
                </div>

                <div className="form-group">
                  <label>Apellido</label>
                  <div className="input-with-icon">
                    <UserIcon size={16} />
                    <input type="text" value={newUser.apellido} onChange={e => setNewUser({...newUser, apellido: e.target.value})} required />
                  </div>
                </div>

                <div className="form-group">
                  <label>Cédula</label>
                  <div className="input-with-icon">
                    <Fingerprint size={16} />
                    <input type="text" value={newUser.cedula} onChange={e => setNewUser({...newUser, cedula: e.target.value})} required />
                  </div>
                </div>

                <div className="form-group">
                  <label>Correo Electrónico</label>
                  <div className="input-with-icon">
                    <Mail size={16} />
                    <input type="email" value={newUser.usuario} onChange={e => setNewUser({...newUser, usuario: e.target.value})} required />
                  </div>
                </div>

                <div className="form-group">
                  <label>Rol Asignado</label>
                  <select className="modal-select" style={{ paddingLeft: '10px' }} value={newUser.rol} onChange={e => setNewUser({ ...newUser, rol: e.target.value })}>
                    {(newUser.rol === 'institucion' ? ROLES_POR_NIVEL.GESTOR : (newUser.nivel === 'MSP' ? ROLES_POR_NIVEL.MSP : ROLES_POR_NIVEL.MUNI)).map(r => (
                      <option key={r.id} value={r.id}>{r.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ flex: 1 }}>
                            <label>{isEditing ? 'Nueva Contraseña' : 'Contraseña'}</label>
                            <div className="input-with-icon">
                                <Key size={16} />
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    value={newUser.password} 
                                    onChange={e => setNewUser({...newUser, password: e.target.value})} 
                                    placeholder={isEditing ? "Dejar vacío si no cambia" : "Obligatorio"} 
                                    required={!isEditing}
                                />
                                <div className="input-actions-inner">
                                    {showPassword ? <EyeOff size={16} onClick={() => setShowPassword(false)} /> : <Eye size={16} onClick={() => setShowPassword(true)} />}
                                </div>
                            </div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label>Confirmar Contraseña</label>
                            <div className="input-with-icon">
                                <Lock size={16} />
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    value={confirmPassword} 
                                    onChange={e => setConfirmPassword(e.target.value)} 
                                    required={newUser.password !== '' || !isEditing}
                                />
                            </div>
                        </div>
                        <button type="button" className="btn-zap" onClick={generateSecurePassword} title="Generar Clave Segura">
                            <Zap size={18} /> Generar
                        </button>
                    </div>
                </div>

                {newUser.rol === 'institucion' && (
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Institución Vinculada</label>
                    <select className="modal-select" style={{ paddingLeft: '10px' }} value={newUser.institucion_id} onChange={e => setNewUser({ ...newUser, institucion_id: e.target.value })}>
                      <option value="">Seleccione...</option>
                      {institucionesDB.map(inst => <option key={inst.id} value={inst.id}>{inst.nombre} ({inst.siglas})</option>)}
                    </select>
                  </div>
                )}

                <div className="form-group" style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <input 
                            type="checkbox" 
                            checked={newUser.activo} 
                            onChange={e => setNewUser({...newUser, activo: e.target.checked})} 
                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <span>El usuario se encuentra activo (Habilita el acceso al sistema)</span>
                    </label>
                </div>
              </div>
              <div className="user-modal__footer">
                <button type="button" className="btn-cancel-modal" onClick={() => setShowCreateModal(false)}>Descartar</button>
                <button type="submit" className="btn-submit-modal">{isEditing ? 'Actualizar Funcionario' : 'Crear Funcionario'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="usuarios-table-container">
        <table className="usuarios-table">
          <thead>
            <tr>
              <th>Funcionario</th>
              <th>Cédula</th>
              <th>Nivel</th>
              <th>Conexión</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.filter(u => u.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) || u.usuario?.toLowerCase().includes(searchQuery.toLowerCase())).map(u => (
              <tr key={u.id}>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: '700', color: '#002f6c' }}>{u.nombre} {u.apellido}</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{u.usuario}</span>
                    <span style={{ fontSize: '0.65rem', color: '#3b82f6', fontWeight: 'bold' }}>{u.rol}</span>
                  </div>
                </td>
                <td>{u.cedula}</td>
                <td><span className={`nivel-badge nivel--${u.nivel}`}>{u.nivel}</span></td>
                <td>{formatLastAccess(u.ultimo_acceso)}</td>
                <td>
                   <div 
                     className={`status-toggle ${u.activo === true || u.activo === 1 ? 'active' : 'inactive'}`}
                     onClick={() => handleToggleStatus(u)}
                     title={u.activo === true || u.activo === 1 ? 'Click para desactivar' : 'Click para activar'}
                   >
                      <div className="status-toggle__dot"></div>
                      <span className="status-toggle__text">
                        {u.activo === true || u.activo === 1 ? 'ACTIVO' : 'INACTIVO'}
                      </span>
                   </div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Edit3 size={18} style={{ cursor: 'pointer', color: '#002f6c' }} onClick={() => handleOpenEdit(u)} title="Editar" />
                    <Trash2 size={18} style={{ cursor: 'pointer', color: '#d33' }} onClick={() => handleDeleteUser(u)} title="Eliminar" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GestionUsuarios;
