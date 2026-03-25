import React, { useState, useEffect } from 'react';
import { FileText, ChevronDown, Download, LayoutGrid, MapPin, AlertTriangle, CheckSquare, BarChart3, TrendingUp, DollarSign } from 'lucide-react';
import { dashboardService } from '../../../services/dashboardService';
import './DashboardGlobal.css';

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
          
          <div className="dashboard-left-column">
            {/* ── Impacto Territorial ── */}
            <section className="dashboard-card-v4 impact-section">
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

            {/* ── Zonas Críticas ── */}
            <section className="dashboard-card-v4 zones-section">
              <div className="card-v4-header">
                <MapPin size={20} className="header-icon" />
                <h3>Focos de Atención Crítica</h3>
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
          </div>

          <div className="dashboard-right-column">
            {/* ── Avance Estratégico (Cascade) ── */}
            <section className="dashboard-card-v4 strategy-section">
              <div className="card-v4-header">
                <TrendingUp size={20} className="header-icon" />
                <h3>Avance por Línea de Acción (Estratégico)</h3>
              </div>
              
              <div className="lineas-cascade-container">
              {lineasDeAccion.map((linea) => (
                <div 
                  key={linea.id} 
                  className={`linea-bar-item ${expandedRow === linea.id ? 'is-expanded' : ''}`}
                >
                  <div 
                    className="linea-bar-header" 
                    onClick={() => setExpandedRow(expandedRow === linea.id ? null : linea.id)}
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

                    <div className="linea-bar-toggle">
                      <ChevronDown size={18} className={expandedRow === linea.id ? 'rotated' : ''} />
                    </div>
                  </div>

                  {expandedRow === linea.id && (
                    <div className="linea-bar-content">
                      <div className="bar-details-grid">
                        <div className="bar-detail">
                          <label>Problemática</label>
                          <p>{linea.problematica}</p>
                        </div>
                        <div className="bar-detail">
                          <label>Indicador</label>
                          <p>{linea.indicador}</p>
                        </div>
                        <div className="bar-detail full">
                          <label>Responsables</label>
                          <div className="bar-tags">
                            {linea.responsables.map((resp, i) => (
                              <span key={i} className="bar-tag">{resp}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardGlobal;
