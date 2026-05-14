import React, { useState } from 'react';
import { useLogin } from '../../../context/LoginContext';
import { User, Mail, IdCard, Shield, Building2, MapPin, Settings2, CheckCircle2, ChevronRight, FileDown, Loader2 } from 'lucide-react';
import { dashboardService } from '../../../services/dashboardService';
import { generateReportePDF } from '../../../utils/reportePDF';
import ProfileSettings from './ProfileSettings';
import './PerfilUsuario.css';

const PerfilUsuario = () => {
    const { user } = useLogin();
    const [showSettings, setShowSettings] = useState(false);
    const [generatingPDF, setGeneratingPDF] = useState(false);

    const handleGeneratePDF = async () => {
        setGeneratingPDF(true);
        try {
            const data = await dashboardService.getFullDashboardData();
            if (data) {
                generateReportePDF(data, user);
            } else {
                alert('No se pudieron obtener los datos para el reporte.');
            }
        } catch (error) {
            console.error('Error generando PDF:', error);
            alert('Error al generar el reporte PDF.');
        } finally {
            setGeneratingPDF(false);
        }
    };

    if (showSettings) {
        return (
            <div className="settings-wrapper">
                <button 
                    onClick={() => setShowSettings(false)}
                    style={{
                        margin: '1rem 2.5rem',
                        padding: '0.5rem 1rem',
                        background: '#f1f5f9',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: 600,
                        color: '#475569'
                    }}
                >
                    ← Volver al Perfil
                </button>
                <ProfileSettings />
            </div>
        );
    }

    const isMSP = user?.nivel === 'MSP';
    const initials = user?.nombre ? user.nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '??';

    return (
        <div className="profile-view-container">
            {/* Cabecera Premium */}
            <div className="profile-header-card">
                <div className="profile-avatar-container">
                    <div className="profile-avatar-big" style={{ 
                        color: isMSP ? 'var(--profile-primary-msp)' : 'var(--profile-primary-muni)',
                        backgroundColor: isMSP ? 'rgba(30, 58, 138, 0.05)' : 'rgba(6, 95, 70, 0.05)'
                    }}>
                        {initials}
                    </div>
                </div>
                
                <div className="profile-info-main">
                    <div className={`role-badge-premium ${!isMSP ? 'muni' : ''}`}>
                        <Shield size={14} /> {user?.rol || 'Funcionario'}
                    </div>
                    <h1>{user?.nombre || 'Cargando...'}</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--profile-text-muted)', fontWeight: 500 }}>
                        <MapPin size={16} /> Puntarenas, Costa Rica
                        <span style={{ margin: '0 0.5rem' }}>•</span>
                        <CheckCircle2 size={16} color="#10b981" /> Cuenta Verificada
                    </div>
                </div>
            </div>

            {/* Contenido en Grid */}
            <div className="profile-details-grid">
                
                {/* Columna: Datos Personales */}
                <div className="profile-section-card">
                    <h3 className="section-title">
                        <User size={20} color={isMSP ? 'var(--profile-primary-msp)' : 'var(--profile-primary-muni)'} /> 
                        Datos Personales
                    </h3>
                    
                    <div className="data-row">
                        <span className="data-label">Cédula de Identidad</span>
                        <div className="data-value">
                            <span className="cedula-highlight" style={{ 
                                color: isMSP ? 'var(--profile-primary-msp)' : 'var(--profile-primary-muni)',
                                borderColor: isMSP ? 'rgba(30, 58, 138, 0.2)' : 'rgba(6, 95, 70, 0.2)'
                            }}>
                                {user?.cedula || '---'}
                            </span>
                        </div>
                    </div>

                    <div className="data-row">
                        <span className="data-label">Correo Institucional</span>
                        <div className="data-value">
                            <Mail size={18} color="#94a3b8" />
                            {user?.email || '---'}
                        </div>
                    </div>
                </div>

                {/* Columna: Afiliación */}
                <div className="profile-section-card">
                    <h3 className="section-title">
                        <Building2 size={20} color={isMSP ? 'var(--profile-primary-msp)' : 'var(--profile-primary-muni)'} /> 
                        Afiliación Institucional
                    </h3>

                    <div className="data-row">
                        <span className="data-label">Nivel de Acceso</span>
                        <div className="level-indicator">
                            <div className="level-icon">
                                <Shield size={24} color={isMSP ? '#1e3a8a' : '#065f46'} />
                            </div>
                            <div className="level-info">
                                <h4>{isMSP ? 'Ministerio de Seguridad Pública' : 'Gobierno Local (Municipalidad)'}</h4>
                                <p>{isMSP ? 'Fuerza Pública de Costa Rica' : 'Gestión de Seguridad Preventiva'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="data-row">
                        <span className="data-label">Estatus de Seguridad</span>
                        <div className="data-value">
                            <div style={{ 
                                width: '10px', 
                                height: '10px', 
                                borderRadius: '50%', 
                                backgroundColor: '#10b981',
                                boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)'
                            }}></div>
                            Operativo - Sin Restricciones
                        </div>
                    </div>
                </div>

            </div>

            <div className="profile-actions-bottom">
                <button
                    className="btn-profile-report"
                    onClick={handleGeneratePDF}
                    disabled={generatingPDF}
                    style={{ 
                        borderColor: isMSP ? 'var(--profile-primary-msp)' : 'var(--profile-primary-muni)',
                        color: isMSP ? 'var(--profile-primary-msp)' : 'var(--profile-primary-muni)'
                    }}
                >
                    {generatingPDF 
                        ? <><Loader2 size={18} className="spin-icon" /> Generando...</>
                        : <><FileDown size={18} /> Generar Reporte PDF</>
                    }
                </button>
                <button 
                    className="btn-profile-edit" 
                    onClick={() => setShowSettings(true)}
                    style={{ background: isMSP ? 'var(--profile-primary-msp)' : 'var(--profile-primary-muni)' }}
                >
                    <Settings2 size={18} /> Configurar Identidad Digital
                </button>
            </div>
        </div>
    );
};

export default PerfilUsuario;
