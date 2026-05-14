import React, { useState, useEffect, useRef } from 'react';
import { useLogin } from '../../../context/LoginContext';
import { useToast } from '../../../context/ToastContext';
import { userService } from '../../../services/userService';
import { securityService } from '../../../services/securityService';
import { ROLES } from '../../../constants/roles';
import { Shield, User, Mail, Smartphone, Lock, Building, IdCard, Save, History, Bell, Key, Timer, Camera, Upload, Trash2 } from 'lucide-react';
import './ProfileSettings.css';

const ProfileSettings = () => {
    const { user: currentUser, updateSessionUser } = useLogin();
    const { showToast } = useToast();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState(null);
    const [windowStatus, setWindowStatus] = useState({ active: false, reason: '', expiresAt: null, reqId: null });
    const [timeLeft, setTimeLeft] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [photoFile, setPhotoFile] = useState(null);
    const photoInputRef = useRef(null);

    const [formData, setFormData] = useState({
        nombre: '',
        usuario: '',
        telefono: '',
        cedula: '',
        password: '',
        confirmPassword: ''
    });

    // Determinar permisos según RBAC
    const isManagement = currentUser?.rol === ROLES.SUPER_ADMIN ||
        currentUser?.rol === ROLES.SUB_ADMIN ||
        currentUser?.rol === ROLES.ADMIN_INSTITUCION;

    const isEditor = currentUser?.rol === ROLES.EDITOR;

    useEffect(() => {
        const loadUserData = async () => {
            if (!currentUser?.id) return;
            try {
                const users = await userService.getUsers();
                const uData = users.find(u => u.id === currentUser.id);
                if (uData) {
                    setUser(uData);
                    setFormData({
                        nombre: uData.nombre || '',
                        usuario: uData.usuario || '',
                        telefono: uData.telefono || '8888-0000',
                        cedula: uData.cedula || '',
                        password: '',
                        confirmPassword: ''
                    });
                    // Cargar foto guardada
                    if (uData.foto) {
                        setPhotoPreview(uData.foto);
                    }

                    // Si es Editor, verificar ventana de aprobación
                    if (uData.rol === ROLES.EDITOR) {
                        const win = await securityService.checkApprovalWindow(uData.id);
                        setWindowStatus(win);
                    }
                }
            } catch (error) {
                showToast('Error al cargar perfil', 'error');
            } finally {
                setLoading(false);
            }
        };
        loadUserData();
    }, [currentUser]);

    // Timer para la ventana de aprobación
    useEffect(() => {
        if (!windowStatus.active || !windowStatus.expiresAt) return;

        const interval = setInterval(() => {
            const now = new Date();
            const end = new Date(windowStatus.expiresAt);
            const diff = end - now;

            if (diff <= 0) {
                setWindowStatus({ active: false, reason: 'VENTANA EXPIRADA (BLOQUEADA)' });
                setTimeLeft(null);
                clearInterval(interval);
            } else {
                const mins = Math.floor(diff / 60000);
                const secs = Math.floor((diff % 60000) / 1000);
                setTimeLeft(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [windowStatus]);

    const handleRequestWindow = async () => {
        setSaving(true);
        const success = await securityService.requestPasswordChange(currentUser);
        if (success) {
            showToast('Solicitud enviada a su superior', 'success');
            setWindowStatus({ active: false, reason: 'PENDIENTE DE APROBACIÓN' });
        } else {
            showToast('Error al enviar solicitud', 'error');
        }
        setSaving(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Manejo de selección de foto
    const handlePhotoSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            showToast('Solo se permiten imágenes JPG, PNG, WEBP o GIF', 'error');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            showToast('La imagen no puede superar los 2 MB', 'warning');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setPhotoPreview(reader.result);
            setPhotoFile(reader.result); // base64 para guardar
        };
        reader.readAsDataURL(file);
    };

    // Eliminar foto
    const handleRemovePhoto = () => {
        setPhotoPreview(null);
        setPhotoFile(''); // string vacío = eliminar en DB
        if (photoInputRef.current) photoInputRef.current.value = '';
    };

    // Obtener iniciales para avatar por defecto
    const getInitials = (nombre) => {
        if (!nombre) return '?';
        return nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            showToast('Las contraseñas no coinciden', 'error');
            return;
        }

        setSaving(true);
        try {
            if (isManagement) {
                const payload = {
                    nombre: formData.nombre,
                    usuario: formData.usuario,
                    telefono: formData.telefono,
                    cedula: formData.cedula,
                };

                if (formData.password) {
                    payload.password = formData.password;
                }

                // Incluir foto solo si cambió
                if (photoFile !== null) {
                    payload.foto = photoFile;
                }

                const updatedUser = await userService.updateUser(currentUser.id, payload);

                // Sincronizar sessionStorage con los datos nuevos
                if (typeof updateSessionUser === 'function') {
                    updateSessionUser({ ...currentUser, ...payload });
                }

                await userService.logSecurityAction({
                    userId: currentUser.id,
                    usuario: currentUser.usuario,
                    rol: currentUser.rol,
                    accion: 'ACTUALIZACION_PERFIL',
                    detalles: `Actualización completa por ${currentUser.nombre}${formData.password ? ' (con cambio de clave)' : ''}${photoFile !== null ? ' (con foto de perfil)' : ''}`
                });
                showToast('Perfil actualizado correctamente', 'success');
                setPhotoFile(null); // reset: ya no hay cambio pendiente
            } else if (isEditor) {
                if (!windowStatus.active) {
                    showToast('No tiene una ventana de cambio autorizada', 'error');
                    return;
                }

                if (!formData.password) {
                    showToast('Debe ingresar la nueva contraseña', 'warning');
                    return;
                }

                const success = await securityService.finalizePasswordChange(
                    currentUser.id,
                    windowStatus.reqId,
                    formData.password
                );

                if (success) {
                    showToast('Contraseña actualizada con éxito', 'success');
                    setWindowStatus({ active: false, reason: '' });
                    setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
                } else {
                    showToast('Error al actualizar contraseña', 'error');
                }
            }
        } catch (error) {
            console.error(error);
            showToast(`Hubo un error: ${error.message}`, 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="profile-loading">Sincronizando seguridad...</div>;

    return (
        <div className="profile-settings-container" style={{ padding: '2rem 2.5rem', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ marginBottom: '2.5rem' }}>
                <span style={{ 
                    display: 'inline-block',
                    padding: '6px 16px',
                    borderRadius: '20px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#e2e8f0',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    letterSpacing: '1px',
                    marginBottom: '1rem',
                    border: '1px solid rgba(255,255,255,0.2)'
                }}>IDENTIDAD Y SEGURIDAD</span>
                <h1 style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: 800, 
                    color: 'white', 
                    margin: '0 0 8px 0',
                    letterSpacing: '-0.5px',
                    textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                }}>Configuración de Perfil</h1>
                <p style={{ 
                    fontSize: '1rem', 
                    color: '#94a3b8', 
                    margin: 0,
                    fontWeight: 500
                }}>Gestión de identidad, accesos corporativos y RBAC</p>
            </div>

            <div className="profile-settings-card" style={{ marginTop: '0' }}>
                <form className="profile-settings-form" onSubmit={handleSave}>
                    <div className="form-sections-grid">

                        {/* ── SECCIÓN FOTO DE PERFIL ── */}
                        {isManagement && (
                            <section className="form-section form-section--photo">
                                <h3><Camera size={18} /> Foto de Perfil</h3>
                                <div className="photo-upload-area">
                                    {/* Avatar / Preview */}
                                    <div className="photo-avatar-wrapper">
                                        {photoPreview ? (
                                            <img
                                                src={photoPreview}
                                                alt="Foto de perfil"
                                                className="photo-avatar-img"
                                            />
                                        ) : (
                                            <div className="photo-avatar-initials">
                                                {getInitials(formData.nombre || user?.nombre)}
                                            </div>
                                        )}
                                        {/* Badge de cámara superpuesto */}
                                        <button
                                            type="button"
                                            className="photo-camera-badge"
                                            onClick={() => photoInputRef.current?.click()}
                                            title="Cambiar foto"
                                        >
                                            <Camera size={14} />
                                        </button>
                                    </div>

                                    {/* Botones de acción */}
                                    <div className="photo-actions">
                                        <button
                                            type="button"
                                            className="btn-upload-photo"
                                            onClick={() => photoInputRef.current?.click()}
                                        >
                                            <Upload size={15} />
                                            {photoPreview ? 'Cambiar imagen' : 'Subir foto'}
                                        </button>
                                        {photoPreview && (
                                            <button
                                                type="button"
                                                className="btn-remove-photo"
                                                onClick={handleRemovePhoto}
                                            >
                                                <Trash2 size={15} />
                                                Eliminar
                                            </button>
                                        )}
                                        <p className="photo-hint">JPG, PNG o WEBP · Máx. 2 MB</p>
                                    </div>

                                    {/* Input oculto */}
                                    <input
                                        ref={photoInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp,image/gif"
                                        style={{ display: 'none' }}
                                        onChange={handlePhotoSelect}
                                    />
                                </div>
                            </section>
                        )}

                        {/* ── SECCIÓN DATOS PERSONALES ── */}
                        <section className="form-section">
                            <h3><User size={18} /> Datos de Identidad</h3>
                            <div className="input-group">
                                <label><IdCard size={14} /> Cédula de Identidad</label>
                                <input 
                                    type="text" 
                                    name="cedula"
                                    value={formData.cedula} 
                                    onChange={handleChange}
                                    disabled={isEditor} 
                                    className={isEditor ? 'input-readonly' : ''} 
                                />
                            </div>

                            <div className="input-group">
                                <label><User size={14} /> Nombre Completo</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    disabled={isEditor}
                                    className={isEditor ? 'input-readonly' : ''}
                                />
                            </div>

                            <div className="input-group">
                                <label><Building size={14} /> Institución Perteneciente</label>
                                <input type="text" value={user?.institucion || 'No asignada'} disabled className="input-readonly" />
                            </div>
                        </section>

                        {/* ── SECCIÓN CONTACTO Y SEGURIDAD ── */}
                        <section className="form-section">
                            <h3><Mail size={18} /> Contacto y Seguridad</h3>
                            <div className="input-group">
                                <label><Mail size={14} /> Correo Electrónico</label>
                                <input
                                    type="email"
                                    name="usuario"
                                    value={formData.usuario}
                                    onChange={handleChange}
                                    disabled={isEditor}
                                    className={isEditor ? 'input-readonly' : ''}
                                />
                            </div>

                            <div className="input-group">
                                <label><Smartphone size={14} /> Teléfono</label>
                                <input
                                    type="text"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    disabled={isEditor}
                                    className={isEditor ? 'input-readonly' : ''}
                                />
                            </div>

                            {isEditor && !windowStatus.active ? (
                                <div className="approval-window-required">
                                    <div className="window-notice">
                                        <Key size={32} />
                                        <h4>Ventana de Aprobación Requerida</h4>
                                        <p>Por políticas de seguridad gubernamental, el cambio de clave de Editor requiere autorización de su superior.</p>
                                        {windowStatus.reason && <span className="window-status-badge">{windowStatus.reason}</span>}
                                    </div>
                                    <button
                                        type="button"
                                        className="btn-request-window"
                                        onClick={handleRequestWindow}
                                        disabled={saving || windowStatus.reason === 'PENDIENTE DE APROBACIÓN'}
                                    >
                                        <Bell size={18} /> {windowStatus.reason === 'PENDIENTE DE APROBACIÓN' ? 'Solicitud en Revisión...' : 'Solicitar Ventana de 15 min'}
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {isEditor && timeLeft && (
                                        <div className="window-timer">
                                            <Timer size={16} /> Ventana activa: <span className="timer-count">{timeLeft} restantes</span>
                                        </div>
                                    )}
                                    <div className="input-group highlight-pass">
                                        <label><Lock size={14} /> Nueva Contraseña (Opcional)</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label><Lock size={14} /> Confirmar Contraseña</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </>
                            )}
                        </section>
                    </div>

                    <div className="profile-security-footer">
                        <div className="security-notice">
                            <History size={16} />
                            <span>Bitácora de auditoría habilitada. IP y sesión serán registradas.</span>
                        </div>
                        {(!isEditor || windowStatus.active) && (
                            <button type="submit" className="btn-save-profile" disabled={saving}>
                                {saving ? 'Cifrando...' : <><Save size={18} /> Aplicar Cambios Seguros</>}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileSettings;
