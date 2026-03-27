import React, { useState, useEffect } from 'react';
import { FileText, ChevronDown, Download, LayoutGrid, MapPin, AlertTriangle, CheckSquare, BarChart3, TrendingUp, DollarSign, Activity, MessageSquare } from 'lucide-react';
import { dashboardService } from '../../../services/dashboardService';
import './DashboardGlobal.css';
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
  const [presupuesto, setPresupuesto] = useState({ ejecutado: 0, asignado: 50000000 });
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
              asignado: dashData.stats.presupuestoAsignado || 50000000
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
      { label: 'Problemática', key: 'problematica' },
      { label: 'Indicador', key: 'indicador' },
      { label: 'Responsables', key: 'responsables' },
      { label: 'Progreso %', key: 'progreso' }
    ];

      responsables: Array.isArray(l.responsables) && l.responsables.length > 0 ? l.responsables.join(' | ') : (l.institucionLider || 'No asignado')

    exportToCSV(exportData, `Indicadores_SembremosSeguridad_${new Date().toLocaleDateString()}`, columns);
  };

  const impactosDistrito = [
    { nombre: 'Barranca', impacto: 85, color: '#ef4444', casos: 124, tendencia: 'up' },
    { nombre: 'El Roble', impacto: 62, color: '#3b82f6', casos: 89, tendencia: 'down' },
    { nombre: 'Chacarita', impacto: 45, color: '#f59e0b', casos: 67, tendencia: 'stable' },
    { nombre: 'Puntarenas Centro', impacto: 30, color: '#10b981', casos: 42, tendencia: 'down' }
  ];

  const zonasCriticas = [
    { id: 1, nombre: 'Parque Victoria', riesgo: 'Alto', hallazgo: 'Venta activa' },
    { id: 2, nombre: 'Barrio El Carmen', riesgo: 'Medio', hallazgo: 'Falta alumbrado' },
    { id: 3, nombre: 'Calle Lucrecia', riesgo: 'Crítico', hallazgo: 'Búnker detectado' }
  ];

  // Solo mostramos las primeras 4 líneas en el dashboard principal
  const top4Lineas = lineasDeAccion.slice(0, 4);

  return (
    <div className={`dashboard-global ${collapsed ? 'sidebar-collapsed' : ''}`}>
      {/* ── Header Banner ── */}
      <header className="dashboard-global__banner">
        <div className="banner-content">
          <div className="dashboard-global__title-block">
            <div className="banner-badge">SISTEMA INTEGRAL DE MONITOREO</div>
            <h1>Dashboard Global Estratégico</h1>
            <p>Observatorio Sembremos Seguridad · Cantón Puntarenas (Periodo 2025)</p>
            <div className="banner-actions" style={{ marginTop: '1rem' }}>
              <button 
                className="btn-export-excel-v4" 
                onClick={handleExportExcel}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  transition: 'all 0.3s ease'
                }}
              >
                <Download size={16} /> Exportar Indicadores
              </button>
            </div>
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
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div className="mini-icon red"><DollarSign size={16} /></div>
                 <span className="mini-val" style={{ fontSize: '0.9rem', color: '#0b2240' }}>
                   ₡{presupuesto.ejecutado ? presupuesto.ejecutado.toLocaleString('es-CR') : '0'} / ₡{presupuesto.asignado.toLocaleString('es-CR')}
                 </span>
               </div>
               <span className="mini-lbl" style={{ marginTop: '4px', display: 'block' }}>Ejecución P.</span>
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
                 <span className="main-prog-val">37.5%</span>
                 <div className="main-prog-bar"><div className="fill" style={{width:'37.5%'}}></div></div>
               </div>
             </div>
          </div>
        </div>
      </header>

      <div className="dashboard-global-body">
        <div className="dashboard-main-grid-layout">
          
          {/* ── Intelligence Quad Center (2x2) ── */}
          <main className="intelligence-grid">
            
            {/* Cuadro 1: Avance Estratégico (Líneas de Acción con Despliegue) */}
            <section className="dashboard-card-v4">
              <div className="card-v4-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={20} className="header-icon" />
                  <h3>Avance Estratégico Cantonal</h3>
                </div>
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
                          <label style={{ display: 'block', fontSize: '0.6rem', textTransform: 'uppercase', color: '#64748b', fontWeight: '900', marginBottom: '4px' }}>Problemática</label>
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

            {/* Cuadro 2: Perfil Dimensional (Radar) */}
            <section className="dashboard-card-v4">
              <div className="card-v4-header">
                <Activity size={20} className="header-icon" />
                <h3>Análisis Dimensional</h3>
              </div>
              <div className="radar-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <RiskRadar />
              </div>
            </section>

            {/* Cuadro 3: Soporte & Comunicación */}
            <section className="dashboard-card-v4">
              <div className="card-v4-header">
                <MessageSquare size={20} className="header-icon" />
                <h3>Centro de Comunicación de Soporte</h3>
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

            {/* Cuadro 4: Impacto Territorial */}
            <section className="dashboard-card-v4">
              <div className="card-v4-header">
                <BarChart3 size={20} className="header-icon" />
                <h3>Impacto Territorial por Distrito</h3>
              </div>
              <div className="impact-distritos-list">
                {impactosDistrito.map((d, i) => (
                  <div key={i} className="distrito-impact-item">
                    <div className="distrito-info">
                      <span className="distrito-name">{d.nombre}</span>
                      <span className="distrito-casos">{d.casos} Incidencias</span>
                    </div>
                    <div className="impact-bar-wrapper">
                      <div className="impact-bar-track">
                        <div className="impact-bar-fill" style={{ width: `${d.impacto}%`, backgroundColor: d.color }}></div>
                      </div>
                      <span className="impact-pct">{d.impacto}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardGlobal;
