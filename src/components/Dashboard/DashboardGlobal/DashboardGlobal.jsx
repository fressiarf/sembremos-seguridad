import React, { useState } from 'react';
import './DashboardGlobal.css';

const DashboardGlobal = () => {
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

  return (
    <div className="dashboard-global">
      {/* ── Header Banner ── */}
      <header className="dashboard-global__banner">
        <div className="banner-content">
          <div className="dashboard-global__title-block">
            <h1>Dashboard global</h1>
            <p>Programa Sembremos Seguridad · Cantón Puntarenas (Periodo 2025)</p>
          </div>
        </div>
      </header>

      <div className="dashboard-global-body">
        {/* ── Main Section: Líneas de Acción (Accordion Style) ── */}
        <section className="lineas-accion-section-v2">
          <h2 className="section-subtitle">Avance Estratégico por Línea de Acción</h2>
          
          <div className="lineas-container">
            {lineasDeAccion.map((linea) => (
              <div key={linea.id} className={`linea-item ${expandedRow === linea.id ? 'is-expanded' : ''}`}>
                <div 
                  className="linea-header" 
                  onClick={() => setExpandedRow(expandedRow === linea.id ? null : linea.id)}
                >
                  <div className="linea-title">
                    <div className="linea-icon-dot" style={{ backgroundColor: linea.progreso > 50 ? '#22c55e' : (linea.progreso > 20 ? '#3b82f6' : '#f59e0b') }} />
                    <span>{linea.titulo}</span>
                  </div>

                  <div className="linea-header-progreso">
                    <div className="header-progreso-bar">
                      <div className="header-progreso-fill" style={{ width: `${linea.progreso}%`, backgroundColor: linea.progreso > 50 ? '#22c55e' : (linea.progreso > 20 ? '#3b82f6' : '#f59e0b') }} />
                    </div>
                    <span className="header-progreso-pct">{linea.progreso}%</span>
                  </div>

                  <div className="linea-toggle-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                  </div>
                </div>

                {expandedRow === linea.id && (
                  <div className="linea-content">
                    <div className="content-grid">
                      <div className="content-item">
                        <label>Problemática</label>
                        <p>{linea.problematica}</p>
                      </div>
                      <div className="content-item">
                        <label>Indicador</label>
                        <p>{linea.indicador}</p>
                      </div>
                      <div className="content-item">
                        <label>Responsables</label>
                        <div className="responsables-list">
                          {linea.responsables.map((resp, i) => (
                            <span key={i} className="resp-tag">{resp}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="progreso-section-v2">
                      <div className="progreso-header">
                        <label>Progreso de la línea</label>
                        <span className="progreso-pct">{linea.progreso}%</span>
                      </div>
                      <div className="progreso-bar-v2">
                        <div className="progreso-fill-v2" style={{ width: `${linea.progreso}%`, backgroundColor: linea.progreso > 50 ? '#22c55e' : (linea.progreso > 20 ? '#3b82f6' : '#f59e0b') }} />
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
  );
};

export default DashboardGlobal;
