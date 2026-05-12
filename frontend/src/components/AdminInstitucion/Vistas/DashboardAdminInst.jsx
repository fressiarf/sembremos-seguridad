import React, { useState, useEffect } from 'react';
import { adminInstitucionService } from '../../../services/adminInstitucionService';
import { useToast } from '../../../context/ToastContext';
import { useLogin } from '../../../context/LoginContext';
import { 
  CheckCircle, Clock, Activity, AlertTriangle, 
  MapPin, Flag, FileText, ChevronRight, FileSearch, Users, Calendar as CalIcon, Target
} from 'lucide-react';
import '../../Dashboard/DashboardGlobal/DashboardGlobal.css'; // Importamos CSS global
import '../AdminInstitucion.css';

const DashboardAdminInst = () => {
  const { user } = useLogin();
  const [data, setData] = useState({
    estadisticas: { totalTareas: 0, completadas: 0, conActividades: 0, sinActividades: 0, reportesPendientes: 0, progreso: 0 },
    urgentes: [], reportesRecientes: []
  });
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      try {
        const result = await adminInstitucionService.getDashboardData(user.id);
        setData(result);
      } catch (e) {
        showToast('Error al cargar dashboard', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.id]);

  if (loading) return <div style={{ padding: '3rem', color: '#7a9cc4' }}>Cargando dashboard...</div>;
  if (!data) return null;

  const { estadisticas: stats, urgentes, reportesRecientes } = data;

  return (
    <div className="dashboard-global">
      {/* ── Header Banner ── */}
      <header className="dashboard-global__banner">
        <div className="banner-content">
          <div className="dashboard-top-stats-grid" style={{ width: '100%' }}>
             <div className="stat-card-mini">
               <div className="mini-icon blue"><Activity size={16} /></div>
               <div className="mini-data">
                 <span className="mini-val">{stats.totalTareas}</span>
                 <span className="mini-lbl">Tareas Asignadas</span>
               </div>
             </div>
             
             <div className="stat-card-mini progress-main-card">
               <span className="mini-lbl">Completadas</span>
               <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                 <div className="mini-icon green"><CheckCircle size={16} /></div>
                 <span className="mini-val" style={{ fontSize: '0.9rem', color: '#0b2240' }}>
                   {stats.completadas} / {stats.totalTareas}
                 </span>
               </div>
               <div className="main-prog-group" style={{ marginTop: '6px' }}>
                 <span className="main-prog-val">{Math.round((stats.completadas / (stats.totalTareas || 1)) * 100)}%</span>
                 <div className="main-prog-bar">
                   <div className="fill" style={{ width: `${Math.min(100, (stats.completadas / (stats.totalTareas || 1)) * 100)}%`, backgroundColor: '#22c55e' }}></div>
                 </div>
               </div>
             </div>

             <div className="stat-card-mini progress-main-card">
               <span className="mini-lbl">Avance General</span>
               <div className="main-prog-group">
                 <span className="main-prog-val">{stats.progreso}%</span>
                 <div className="main-prog-bar"><div className="fill" style={{width:`${stats.progreso}%`, backgroundColor: '#8b5cf6'}}></div></div>
               </div>
             </div>
          </div>
        </div>
      </header>

      <div className="dashboard-global-body">
        <div className="dashboard-main-grid-layout" style={{ display: 'block' }}>
          
          <main className="intelligence-grid">
            
            {/* Card 1: Tareas Urgentes / Próximas a Vencer */}
            <section className="dashboard-card-v4">
              <div className="card-v4-header">
                <AlertTriangle size={20} className="header-icon" style={{ color: '#ef4444' }} />
                <h3>Tareas Urgentes</h3>
              </div>
              <div className="timeline-list" style={{ padding: '0 1rem', maxHeight: '400px', overflowY: 'auto' }}>
                {urgentes.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No hay tareas urgentes.</div>
                ) : (
                  urgentes.map(t => {
                    const vencida = t.diasRestantes < 0;
                    return (
                      <div key={t.id} className="timeline-item" style={{ borderLeftColor: vencida ? '#ef4444' : '#f59e0b' }}>
                        <div className="timeline-icon" style={{ color: vencida ? '#ef4444' : '#f59e0b' }}>
                          <Clock size={14} />
                        </div>
                        <div className="timeline-content">
                          <p className="timeline-title" style={{ fontSize: '0.85rem' }}>{t.titulo}</p>
                          <p className="timeline-sub">
                            <MapPin size={10} style={{ marginRight: '4px' }} /> {t.zona} | Resp: {t.responsable?.nombre || 'Sin asignar'}
                          </p>
                          <div style={{ marginTop: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="mini-tag" style={{ 
                                background: vencida ? '#fef2f2' : '#fffbeb', 
                                color: vencida ? '#b91c1c' : '#b45309', 
                                border: `1px solid ${vencida ? '#fecaca' : '#fde68a'}`, 
                                padding: '2px 6px', 
                                borderRadius: '4px', 
                                fontSize: '0.65rem', 
                                fontWeight: 700 
                              }}>
                              {vencida ? `Vencida hace ${Math.abs(t.diasRestantes)} días` : `${t.diasRestantes} días restantes`}
                            </span>
                            <span style={{ fontSize: '0.65rem', fontWeight: 600, color: '#64748b' }}>{t.estado}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </section>

            {/* Card 2: Reportes Esperando Revisión */}
            <section className="dashboard-card-v4">
              <div className="card-v4-header">
                <FileSearch size={20} className="header-icon" style={{ color: '#f59e0b' }} />
                <h3>Reportes Pendientes ({stats.reportesPendientes})</h3>
              </div>
              <div className="support-summary-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {reportesRecientes.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No hay reportes pendientes de revisión.</div>
                ) : (
                  reportesRecientes.map(r => (
                    <div key={r.id} className="support-summary-item">
                      <div className="support-msg-info" style={{ flex: 1 }}>
                         <span className="support-inst-badge">{r.responsable?.nombre}</span>
                         <p className="support-msg-text" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', marginTop: '4px' }}>{r.tarea?.titulo}</p>
                         <p className="support-msg-text" style={{ fontSize: '0.75rem', marginTop: '2px', color: '#64748b' }}>
                           {r.descripcion.length > 80 ? r.descripcion.substring(0, 80) + '...' : r.descripcion}
                         </p>
                         <div style={{ display: 'flex', gap: '8px', marginTop: '6px', fontSize: '0.65rem', color: '#94a3b8' }}>
                            <span><CalIcon size={10} style={{ verticalAlign: 'middle', marginRight: '2px' }} /> {r.fecha}</span>
                            <span>👥 {r.beneficiados} beneficiados</span>
                         </div>
                      </div>
                      <div className="support-status-dot pendiente" style={{ backgroundColor: '#f59e0b' }}></div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Card 3: Despliegue de Tareas */}
            <section className="dashboard-card-v4">
              <div className="card-v4-header">
                <Users size={20} className="header-icon" style={{ color: '#3b82f6' }} />
                <h3>Despliegue Operativo</h3>
              </div>
              <div className="lineas-cascade-container">
                 <div className="cir-inst-row" style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ flex: 1 }}>
                      <div className="cir-inst-row">
                        <span className="cir-inst-name">Tareas con Actividades</span>
                        <span className="cir-inst-budget">{stats.conActividades}</span>
                      </div>
                      <div className="impact-bar-track" style={{ height: '6px' }}>
                        <div className="impact-bar-fill" style={{ width: `${Math.round((stats.conActividades / (stats.totalTareas || 1)) * 100)}%`, backgroundColor: '#3b82f6' }} />
                      </div>
                    </div>
                 </div>
                 <div className="cir-inst-row" style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ flex: 1 }}>
                      <div className="cir-inst-row">
                        <span className="cir-inst-name">Tareas Completadas</span>
                        <span className="cir-inst-budget">{stats.completadas}</span>
                      </div>
                      <div className="impact-bar-track" style={{ height: '6px' }}>
                        <div className="impact-bar-fill" style={{ width: `${Math.round((stats.completadas / (stats.totalTareas || 1)) * 100)}%`, backgroundColor: '#22c55e' }} />
                      </div>
                    </div>
                 </div>
                 <div className="cir-inst-row" style={{ padding: '10px 0' }}>
                    <div style={{ flex: 1 }}>
                      <div className="cir-inst-row">
                        <span className="cir-inst-name">Tareas Sin Actividades</span>
                        <span className="cir-inst-budget">{stats.sinActividades}</span>
                      </div>
                      <div className="impact-bar-track" style={{ height: '6px' }}>
                        <div className="impact-bar-fill" style={{ width: `${Math.round((stats.sinActividades / (stats.totalTareas || 1)) * 100)}%`, backgroundColor: '#ef4444' }} />
                      </div>
                    </div>
                 </div>
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdminInst;

