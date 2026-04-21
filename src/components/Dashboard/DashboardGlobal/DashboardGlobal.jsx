import React, { useState, useEffect } from 'react';
import { FileText, ChevronDown, Download, LayoutGrid, MapPin, AlertTriangle, CheckSquare, BarChart3, TrendingUp, DollarSign, Activity, MessageSquare, PieChart, Users, Camera, AlertCircle } from 'lucide-react';
import { dashboardService } from '../../../services/dashboardService';
import './DashboardGlobal.css';
import SkeletonLoader from '../../Shared/SkeletonLoader';
import PageTransition from '../../Shared/PageTransition';
import ReactECharts from 'echarts-for-react';
import { exportToCSV } from '../../../utils/exportUtils';

const RiskRadar = () => {
  const option = {
    radar: {
      indicator: [
        { name: 'Prevención', max: 100 },
        { name: 'Entorno', max: 100 },
        { name: 'Monitoreo', max: 100 },
        { name: 'Operatividad', max: 100 },
        { name: 'Ciudadanía', max: 100 }
      ],
      shape: 'circle',
      splitNumber: 5,
      axisName: {
        color: '#002f6c',
        fontWeight: '800',
        fontSize: 10,
        padding: [3, 5]
      },
      splitLine: {
        lineStyle: {
          color: [
            'rgba(226, 232, 240, 0.5)',
            'rgba(226, 232, 240, 0.6)',
            'rgba(226, 232, 240, 0.7)',
            'rgba(226, 232, 240, 0.8)',
            'rgba(226, 232, 240, 1)'
          ]
        }
      },
      splitArea: {
        areaStyle: {
          color: ['#f8fafc', '#ffffff']
        }
      },
      axisLine: {
        lineStyle: {
          color: '#e2e8f0'
        }
      }
    },
    series: [
      {
        name: 'Perfil de Riesgo',
        type: 'radar',
        data: [
          {
            value: [85, 42, 68, 35, 55],
            name: 'Puntarenas Centro',
            symbol: 'circle',
            symbolSize: 6,
            itemStyle: {
              color: '#002f6c'
            },
            areaStyle: {
              color: 'rgba(0, 47, 108, 0.15)',
              opacity: 0.6
            },
            lineStyle: {
              width: 3,
              color: '#002f6c'
            }
          }
        ]
      }
    ],
    tooltip: {
      show: true,
      trigger: 'item'
    }
  };

  return <ReactECharts option={option} style={{ height: '300px', width: '100%' }} />;
};

const DashboardGlobal = ({ collapsed, onViewChange }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [presupuesto, setPresupuesto] = useState({ ejecutado: 0, asignado: 50000000, cumplimiento: 0 });
  const [lineasDeAccion, setLineasDeAccion] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashData = await dashboardService.getFullDashboardData();
        if (dashData) {
          if (dashData.stats) {
            setPresupuesto({
              ejecutado: dashData.stats.inversionTotal || 0,
              asignado: dashData.stats.presupuestoAsignado || 50000000,
              cumplimiento: dashData.stats.cumplimiento || 0
            });
          }
          if (dashData.lineas) {
            setLineasDeAccion(dashData.lineas);
          }
        }
      } catch (e) {
        console.error("Error al obtener datos del dashboard", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleExportExcel = () => {
    const columns = [
      { label: 'Título', key: 'titulo' },
      { label: 'Línea de Acción', key: 'problematica' },
      { label: 'Indicador', key: 'indicador' },
      { label: 'Responsables', key: 'responsables' },
      { label: 'Progreso %', key: 'progreso' }
    ];

    const exportData = lineasDeAccion.map(l => ({
      titulo: l.titulo,
      problematica: l.problematica,
      indicador: l.indicador || '',
      responsables: Array.isArray(l.responsables) ? l.responsables.join(' | ') : (l.institucionLider || 'No asignado'),
      progreso: `${l.progreso}%`
    }));

    exportToCSV(exportData, `Indicadores_SembremosSeguridad_${new Date().toLocaleDateString()}`, columns);
  };

  const top4Lineas = lineasDeAccion.slice(0, 4);

  if (loading) {
    return <PageTransition><SkeletonLoader type="dashboard" /></PageTransition>;
  }

  return (
    <PageTransition className={`dashboard-global ${collapsed ? 'dashboard-global--collapsed' : ''}`}>
      
      {/* ── Header Banner ── */}
      <header className="dashboard-global__banner">
        <div className="banner-content">
          <div className="dashboard-global__title-block">
            <div className="banner-badge">SISTEMA INTEGRAL DE MONITOREO</div>
            <h1>Dashboard Global Estratégico</h1>
            <p>Observatorio Sembremos Seguridad · Cantón Puntarenas (Periodo 2025)</p>
          </div>

          <div className="dashboard-top-stats-grid">
             <div className="stat-card-mini">
               <div className="mini-icon blue"><CheckSquare size={16} /></div>
               <div className="mini-data">
                 <span className="mini-val">42/120</span>
                 <span className="mini-lbl">Tareas</span>
               </div>
             </div>
             <div className="stat-card-mini progress-main-card">
               <span className="mini-lbl">Ejecución P.</span>
               <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                 <div className="mini-icon red"><DollarSign size={16} /></div>
                 <span className="mini-val" style={{ fontSize: '0.9rem', color: '#0b2240' }}>
                   ₡{presupuesto.ejecutado ? presupuesto.ejecutado.toLocaleString('es-CR') : '0'} / ₡{presupuesto.asignado.toLocaleString('es-CR')}
                 </span>
               </div>
               <div className="main-prog-group" style={{ marginTop: '6px' }}>
                 <span className="main-prog-val">{Math.round((presupuesto.ejecutado / presupuesto.asignado) * 100)}%</span>
                 <div className="main-prog-bar">
                   <div className="fill" style={{ width: `${Math.min(100, (presupuesto.ejecutado / presupuesto.asignado) * 100)}%`, backgroundColor: '#3b82f6' }}></div>
                 </div>
               </div>
             </div>
             <div className="stat-card-mini progress-main-card">
               <span className="mini-lbl">Progreso Cantonal</span>
               <div className="main-prog-group">
                 <span className="main-prog-val">{presupuesto.cumplimiento}%</span>
                 <div className="main-prog-bar"><div className="fill" style={{width:`${presupuesto.cumplimiento}%`}}></div></div>
               </div>
             </div>
          </div>
        </div>
      </header>

      <div className="dashboard-global-body">
        <div className="dashboard-main-grid-layout" style={{ display: 'block' }}>
          
          {/* ── Intelligence Grid 3x2 ── */}
          <main className="intelligence-grid">
            
            {/* Cuadro 1: Avance Estratégico (Líneas de Acción con Despliegue) */}
            <section className="dashboard-card-v4">
              <div className="card-v4-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={20} className="header-icon" />
                  <h3>Avance Estratégico Cantonal</h3>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="btn-export-excel" 
                    onClick={handleExportExcel}
                    style={{
                      background: '#ecfdf5',
                      border: '1px solid #10b981',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      color: '#047857',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Download size={12} /> Excel
                  </button>
                  <button 
                    onClick={() => onViewChange('lineas-accion')}
                    style={{
                      background: '#f1f5f9',
                      border: '1px solid #e2e8f0',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      color: '#002f6c',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <LayoutGrid size={12} /> Ver todas
                  </button>
                </div>
              </div>
              <div className="lineas-cascade-container">
                {loading ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Cargando líneas estratégicas...</div>
                ) : top4Lineas.length > 0 ? (
                  top4Lineas.map((linea) => (
                    <div 
                      key={linea.id} 
                      className={`linea-bar-item ${expandedRow === linea.id ? 'is-expanded' : ''}`}
                    >
                    <div 
                      className="linea-bar-header-click" 
                      onClick={() => setExpandedRow(expandedRow === linea.id ? null : linea.id)}
                      style={{ cursor: 'pointer', position: 'relative' }}
                    >
                      <div className="linea-bar-title-group">
                        <div className="linea-bar-dot" style={{ backgroundColor: linea.progreso > 50 ? '#22c55e' : (linea.progreso > 20 ? '#3b82f6' : '#f59e0b') }} />
                        <span className="linea-bar-label">{linea.titulo}</span>
                      </div>
                      <div className="linea-bar-progress-section">
                        <div className="linea-bar-track">
                          <div 
                            className="linea-bar-fill" 
                            style={{ 
                              width: `${linea.progreso}%`, 
                              backgroundColor: linea.progreso > 50 ? '#22c55e' : (linea.progreso > 20 ? '#3b82f6' : '#f59e0b') 
                            }} 
                          />
                        </div>
                        <span className="linea-bar-pct">{linea.progreso}%</span>
                      </div>
                      <div className={`linea-bar-toggle-icon ${expandedRow === linea.id ? 'rotated' : ''}`} style={{ position: 'absolute', top: '10px', right: '0', color: '#94a3b8', transition: 'transform 0.3s' }}>
                        <ChevronDown size={14} />
                      </div>
                    </div>

                    {expandedRow === linea.id && (
                      <div className="linea-bar-content-mini" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                        <div className="sidebar-detail-block">
                          <label style={{ display: 'block', fontSize: '0.6rem', textTransform: 'uppercase', color: '#64748b', fontWeight: '900', marginBottom: '4px' }}>Línea de Acción</label>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: '#1e293b', lineHeight: '1.4', fontWeight: '500' }}>{linea.problematica}</p>
                        </div>
                        <div className="sidebar-detail-block" style={{ marginTop: '1rem' }}>
                          <label style={{ display: 'block', fontSize: '0.6rem', textTransform: 'uppercase', color: '#64748b', fontWeight: '900', marginBottom: '4px' }}>Responsables</label>
                          <div className="sidebar-tags-mini" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                            {Array.isArray(linea.responsables) ? (
                              linea.responsables.map((r, i) => (
                                <span key={i} className="mini-tag" style={{ background: '#eff6ff', color: '#1e3a8a', fontSize: '0.65rem', fontWeight: '700', padding: '2px 8px', borderRadius: '4px', border: '1px solid #dbeafe' }}>{r}</span>
                              ))
                            ) : (
                              <span className="mini-tag" style={{ background: '#eff6ff', color: '#1e3a8a', fontSize: '0.65rem', fontWeight: '700', padding: '2px 8px', borderRadius: '4px', border: '1px solid #dbeafe' }}>{linea.institucionLider || 'Sin asignar'}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  ))
                ) : (
                  <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No hay líneas de acción registradas.</div>
                )}
              </div>
            </section>

            {/* ── Card 2: Panel de Articulación (Mesa CIR) ── */}
            <section className="dashboard-card-v4">
              <div className="card-v4-header">
                <Users size={20} className="header-icon" />
                <h3>Articulación Institucional</h3>
              </div>
              <div className="lineas-cascade-container">
                {[
                  { inst: 'Fuerza Pública', tasks: 12, budget: '₡15M', prog: 75, color: '#3b82f6' },
                  { inst: 'IMAS', tasks: 8, budget: '₡20M', prog: 40, color: '#f59e0b' },
                  { inst: 'PANI', tasks: 5, budget: '₡8M', prog: 60, color: '#10b981' },
                  { inst: 'Municipalidad', tasks: 15, budget: '₡5M', prog: 20, color: '#ef4444' }
                ].map((item, idx) => (
                  <div key={idx} className="cir-inst-row" style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ flex: 1 }}>
                      <div className="cir-inst-row">
                        <span className="cir-inst-name">{item.inst}</span>
                        <span className="cir-inst-budget">{item.budget}</span>
                      </div>
                      <div className="impact-bar-track" style={{ height: '6px' }}>
                        <div className="impact-bar-fill" style={{ width: `${item.prog}%`, backgroundColor: item.color }} />
                      </div>
                      <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '4px' }}>{item.tasks} tareas / {item.prog}% avance</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Card 3: Semáforo de Peligro (Mapa) ── */}
            <section className="dashboard-card-v4">
              <div className="card-v4-header">
                <MapPin size={20} className="header-icon" />
                <h3>Semáforo Territorial</h3>
              </div>
              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>Concentración de Riesgo Actual</p>
                
                {/* SVG mock minimap */}
                <div style={{ height: '180px', width: '100%', background: '#f8fafc', borderRadius: '12px', position: 'relative', overflow: 'hidden', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={48} color="#ef4444" style={{ opacity: 0.2, position: 'absolute' }} />
                  
                  {/* Heat zones */}
                  <div style={{ position: 'absolute', top: '30%', left: '40%', width: '40px', height: '40px', background: 'radial-gradient(circle, rgba(239,68,68,0.6) 0%, rgba(239,68,68,0) 70%)' }}></div>
                  <div style={{ position: 'absolute', top: '60%', left: '60%', width: '30px', height: '30px', background: 'radial-gradient(circle, rgba(245,158,11,0.6) 0%, rgba(245,158,11,0) 70%)' }}></div>
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="mini-tag" style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600 }}>Alta: Barranca</span>
                  <span className="mini-tag" style={{ background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600 }}>Media: Chacarita</span>
                </div>
              </div>
            </section>

            {/* ── Card 4: Insumo Metodológico ── */}
            <section className="dashboard-card-v4">
              <div className="card-v4-header">
                <PieChart size={20} className="header-icon" />
                <h3>Fundamento Metodológico</h3>
              </div>
              <div style={{ padding: '0 1rem' }}>
                <RiskRadar />
              </div>
              <div className="card-v4-footer-info" style={{ marginTop: 0, borderTop: 'none', background: 'white' }}>
                 <p style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>Top Factores de Riesgo (Pareto):</p>
                 <ul style={{ margin: '4px 0 0', paddingLeft: '1.2rem', color: '#64748b' }}>
                    <li>Venta de drogas (Alta influencia)</li>
                    <li>Desempleo juvenil</li>
                 </ul>
              </div>
            </section>

            {/* ── Card 5: Feed Evidencias y Alertas ── */}
            <section className="dashboard-card-v4">
              <div className="card-v4-header">
                <Camera size={20} className="header-icon" />
                <h3>Feed de Evidencias y Alertas</h3>
              </div>
              <div className="timeline-list">
                
                <div className="timeline-item alert-timeline">
                  <div className="timeline-icon"><AlertCircle size={14} /></div>
                  <div className="timeline-content">
                    <p className="timeline-title">Alerta de Cumplimiento</p>
                    <p className="timeline-sub">Tarea "Recuperación Parque Central" (IMAS) vence en 2 días sin evidencia.</p>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-icon"><CheckSquare size={14} color="#10b981" /></div>
                  <div className="timeline-content">
                    <p className="timeline-title">Evidencia Validada: Fuerza Pública</p>
                    <p className="timeline-sub">Operativo focalizado en Chacarita. 150 impactados.</p>
                    <div className="timeline-image" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=400&auto=format&fit=crop)' }}></div>
                  </div>
                </div>

              </div>
            </section>

            {/* ── Card 6: Centro de Comunicación ── */}
            <section className="dashboard-card-v4 dashboard-card-v4--support">
              <div className="card-v4-header">
                <MessageSquare size={20} className="header-icon" />
                <h3>Centro de Soporte</h3>
              </div>
              <div className="support-summary-list">
                {[
                  { id: 1, inst: 'PANI', msg: 'Solicitud de refuerzo técnico en Tarea #4', status: 'Pendiente' },
                  { id: 2, inst: 'Fuerza Pública', msg: 'Reporte de patrullaje subido', status: 'Respondido' },
                  { id: 3, inst: 'IMAS', msg: 'Duda con asignación presupuestaria', status: 'Leído' }
                ].map(msg => (
                  <div key={msg.id} className="support-summary-item">
                    <div className="support-msg-info">
                       <span className="support-inst-badge">{msg.inst}</span>
                       <p className="support-msg-text">{msg.msg}</p>
                    </div>
                    <div className={`support-status-dot ${msg.status.toLowerCase()}`}></div>
                  </div>
                ))}
              </div>
              <div className="card-v4-footer-info">
                 <p>Canal directo con el Administrador para gestiones técnicas.</p>
              </div>
            </section>



          </main>
        </div>
      </div>
    </PageTransition>
  );
};

export default DashboardGlobal;
