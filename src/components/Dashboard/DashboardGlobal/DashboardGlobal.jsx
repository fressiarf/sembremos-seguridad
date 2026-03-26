import React, { useState, useEffect } from 'react';
import { FileText, ChevronDown, Download, LayoutGrid, MapPin, AlertTriangle, CheckSquare, BarChart3, TrendingUp, DollarSign, Activity } from 'lucide-react';
import { dashboardService } from '../../../services/dashboardService';
import './DashboardGlobal.css';
import ReactECharts from 'echarts-for-react';

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

const DashboardGlobal = ({ collapsed }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [presupuesto, setPresupuesto] = useState({ ejecutado: 0, asignado: 50000000 });

  useEffect(() => {
    const fetchPresupuesto = async () => {
      try {
        const dashData = await dashboardService.getFullDashboardData();
        if (dashData && dashData.stats) {
          setPresupuesto({
            ejecutado: dashData.stats.inversionTotal || 0,
            asignado: dashData.stats.presupuestoAsignado || 50000000
          });
        }
      } catch (e) {
        console.error("Error al obtener presupuesto", e);
      }
    };
    fetchPresupuesto();
  }, []);

  const lineasDeAccion = [
    {
      id: 1,
      titulo: 'Consumo de drogas',
      problematica: 'Incremento en el consumo de sustancias psicoactivas en centros educativos y parques.',
      indicador: 'Reducción del 15% en reportes de consumo en zonas intervenidas.',
      responsables: ['Ministerio de Salud', 'IAFA', 'Fuerza Pública'],
      progreso: 65,
    },
    {
      id: 2,
      titulo: 'Venta de drogas',
      problematica: 'Proliferación de focos de comercialización (búnkeres) en barrios residenciales.',
      indicador: 'Aumento en un 20% de incautaciones y desarticulación de puntos de venta.',
      responsables: ['O.I.J.', 'Fuerza Pública', 'Ministerio Público'],
      progreso: 40,
    },
    {
      id: 3,
      titulo: 'Personas en situación de calle',
      problematica: 'Alta concentración de personas sin hogar con problemas de salud mental y adicciones en el casco urbano.',
      indicador: 'Número de personas reubicadas en albergues o insertadas en programas de atención institucional.',
      responsables: ['PANI', 'IMAS', 'Municipalidad', 'Cruz Roja'],
      progreso: 30,
    },
    {
      id: 4,
      titulo: 'Falta de inversión social',
      problematica: 'Baja presencia de programas deportivos, culturales y educativos de prevención en comunidades vulnerables.',
      indicador: 'Número de proyectos de infraestructura social y programas recreativos ejecutados.',
      responsables: ['ICODER', 'Ministerio de Cultura', 'IMAS', 'DINADECO'],
      progreso: 15,
    }
  ];

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

  return (
    <div className={`dashboard-global ${collapsed ? 'sidebar-collapsed' : ''}`}>
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
              <div className="card-v4-header">
                <TrendingUp size={20} className="header-icon" />
                <h3>Avance Estratégico Cantonal</h3>
              </div>
              <div className="lineas-cascade-container">
                {lineasDeAccion.map((linea) => (
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
                            {linea.responsables.map((r, i) => (
                              <span key={i} className="mini-tag" style={{ background: '#eff6ff', color: '#1e3a8a', fontSize: '0.65rem', fontWeight: '700', padding: '2px 8px', borderRadius: '4px', border: '1px solid #dbeafe' }}>{r}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
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

            {/* Cuadro 3: Zonas de Atención */}
            <section className="dashboard-card-v4">
              <div className="card-v4-header">
                <MapPin size={20} className="header-icon" />
                <h3>Zonas de Monitoreo Crítico</h3>
              </div>
              <div className="zones-summary-grid">
                {zonasCriticas.map(z => (
                  <div key={z.id} className="zone-summary-item">
                    <div className="zone-badge" data-level={z.riesgo}>{z.riesgo}</div>
                    <div className="zone-details">
                      <strong>{z.nombre}</strong>
                      <p>{z.hallazgo}</p>
                    </div>
                  </div>
                ))}
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
