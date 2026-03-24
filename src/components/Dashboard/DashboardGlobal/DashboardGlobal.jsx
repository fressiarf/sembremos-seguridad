import React, { useState } from 'react';
import { FileText, Image as ImageIcon, FileCheck, ChevronDown, Plus, Download, LayoutGrid } from 'lucide-react';
import './DashboardGlobal.css';

const DashboardGlobal = ({ collapsed }) => {
  const [expandedRow, setExpandedRow] = useState(null);

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

  const informesAvance = [
    {
      id: 101,
      titulo: 'Centro Cívico por la Paz',
      descripcion: 'Transformación de espacio y uso regular por jóvenes.',
      lineaId: 4,
      color: '#22c55e',
      evidencias: [
        { type: 'image', name: 'Fachada_Final.jpg' },
        { type: 'pdf', name: 'Informe_Trimestral.pdf' }
      ]
    },
    {
      id: 102,
      titulo: 'Mercadito Navideño',
      descripcion: 'Feria de emprendimiento juvenil con éxito (L#4).',
      lineaId: 4,
      color: '#3b82f6',
      evidencias: [
        { type: 'image', name: 'Evento_INA.png' }
      ]
    },
    {
      id: 103,
      titulo: 'Operativo "Parques Seguros"',
      descripcion: 'Recuperación de 3 parques en zona central.',
      lineaId: 1,
      color: '#f59e0b',
      evidencias: [
        { type: 'pdf', name: 'Acta_Decomisos.pdf' },
        { type: 'image', name: 'Antes_Despues.jpg' }
      ]
    }
  ];

  return (
    <div className={`dashboard-global ${collapsed ? 'sidebar-collapsed' : ''}`}>
      {/* ── Header Banner ── */}
      <header className="dashboard-global__banner">
        <div className="banner-content">
          <div className="dashboard-global__title-block">
            <h1>Dashboard global</h1>
            <p>Programa Sembremos Seguridad · Cantón Puntarenas (Periodo 2025)</p>
          </div>

          {/* Dashboard Summary Stats (Top Right) */}
          <div className="dashboard-summary-stats">
            <div className="stat-pill">
              <span className="stat-label">Progreso General</span>
              <div className="stat-value-group">
                <span className="stat-value">37.5%</span>
                <div className="stat-mini-bar">
                  <div className="stat-mini-fill" style={{ width: '37.5%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-global-body">
        <div className="dashboard-sections-stack">
          
          {/* ── Section 1: Avance Estratégico (Grid 2x2) ── */}
          <section className="dashboard-section-v3">
            <div className="section-header-row-v3">
              <h2 className="section-subtitle-v3">
                <FileText size={22} className="subtitle-icon" /> 
                <span>Avance Estratégico por Línea de Acción</span>
                <div className="section-badge inline">4 Líneas Activas</div>
              </h2>
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

                      {/* Informes vinculados */}
                      <div className="bar-reports-container">
                        <div className="reports-label-mini">
                          <FileText size={14} />
                          <span>Reportes de Ejecución</span>
                        </div>
                        <div className="reports-mini-grid">
                          {informesAvance
                            .filter(inf => inf.lineaId === linea.id)
                            .map(informe => (
                              <div key={informe.id} className="report-mini-card">
                                <div className="report-mini-header">
                                  <h5>{informe.titulo}</h5>
                                  <span className="report-mini-date">Hace 2 días</span>
                                </div>
                                <p>{informe.descripcion}</p>
                                <div className="report-mini-evidencia">
                                  {informe.evidencias.map((ev, i) => (
                                    <div key={i} className={`mini-ev-tag ${ev.type}`}>
                                      {ev.type === 'image' ? <ImageIcon size={10} /> : <FileText size={10} />}
                                      <span>{ev.name.split('.')[0]}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))
                          }
                          <button className="btn-add-report-bar">
                            <Plus size={14} />
                            Añadir Avance
                          </button>
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

  );
};

export default DashboardGlobal;
