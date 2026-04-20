import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../../services/dashboardService';
import { Users, ClipboardList, Clock, Plus } from 'lucide-react';
import './zonas.css';

const PinIcon = () => (
  <svg className="zona-icon zona-icon-pin" width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const GlobeIcon = () => (
  <svg className="zona-icon zona-icon-globe" width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

function ZonasCriticas() {
  const [zonas, setZonas] = useState([]);

  useEffect(() => {
    dashboardService.getZonas()
      .then(data => {
        setZonas(data);
      })
      .catch(err => console.error("Error fetching zonas", err));
  }, []);

  const renderZonaCard = (zona) => {
    const conf = {
      classNameModifier: zona.tag || 'default',
      percentageText: `${zona.avance || 0}%`,
      lineas: zona.lineas || 0,
      completadas: zona.completadas || 0,
      retrasadas: zona.retrasadas || 0,
      beneficiarios: zona.beneficiarios || 0,
      iconType: zona.icon || 'pin'
    };
    return (
      <div key={zona.id} className={`zona-card ${zona.nombre === 'Cantonal' ? 'zona-card-cantonal' : ''}`}>
        
        {zona.nombre !== 'Cantonal' && (
          <div className={`zona-card-image zona-img-${conf.classNameModifier}`}>
            <div className="zona-card-overlay"></div>
          </div>
        )}
        
        <div className="zona-card-content">
          <div className="zona-title-row">
              <div className="zona-title">
                {conf.iconType === 'globe' ? <GlobeIcon /> : <PinIcon />}
                <h3>{zona.nombre}</h3>
              </div>
              <span className={`zona-percentage zona-color-${conf.classNameModifier}`}>{conf.percentageText}</span>
          </div>
          
          <div className="zona-progress-bg">
              <div 
                className={`zona-progress-fill zona-fill-${conf.classNameModifier}`}
                style={{ width: conf.percentageText }}
              ></div>
          </div>

          <div className="zona-stats">
              <div className="zona-stat-row">
                <span className="stat-label">Nivel</span>
                <span className="stat-value">{zona.nivel}</span>
              </div>
              <div className="zona-stat-row">
                <span className="stat-label">Incidentes</span>
                <span className="stat-value">{zona.incidentes}</span>
              </div>
              <div className="zona-stat-row">
                <span className="stat-label">Líneas activas</span>
                <span className="stat-value">{conf.lineas}</span>
              </div>
              <div className="zona-stat-row">
                <span className="stat-label">Completadas</span>
                <span className="stat-value completadas-value">{conf.completadas}</span>
              </div>
              
              <hr className="zona-divider" />
              
              <div className="zona-stat-row">
                <span className="stat-label">Beneficiarios</span>
                <span className="stat-value beneficiarios-value">{conf.beneficiarios}</span>
              </div>
          </div>
        </div>
      </div>
    );
  };

  const localZonas = zonas.filter(z => z.nombre !== 'Cantonal');
  const cantonalZona = zonas.filter(z => z.nombre === 'Cantonal');

  return (
    <div className="zonas-criticas-container">
      <div className="zonas-criticas-header">
        <div>
           <h2 className="zonas-page-title">Zonas críticas</h2>
           <p className="zonas-page-subtitle">Seguimiento territorial del programa</p>
        </div>
        <div className="zonas-header-actions">
           <div className="admin-badge">
              <span className="admin-badge-dot"></span>
              Administrador
           </div>
        </div>
      </div>
      
      <div className="zonas-grid">
        {localZonas.map(renderZonaCard)}
      </div>

      {cantonalZona.length > 0 && (
        <div className="cantonal-section">
          <div className="cantonal-separator">
            <span className="cantonal-label">Resumen Cantonal</span>
            <hr className="cantonal-line" />
          </div>
          
          <div className="cantonal-metrics-grid">
            <div className="cantonal-metric-card green">
              <div className="metric-icon-box">
                <Users size={20} />
              </div>
              <div className="metric-info">
                <span className="metric-number">02</span>
                <span className="metric-label">Oficiales registrados</span>
              </div>
            </div>

            <div className="cantonal-metric-card blue">
              <div className="metric-icon-box">
                <ClipboardList size={20} />
              </div>
              <div className="metric-info">
                <span className="metric-number">04</span>
                <span className="metric-label">Tareas estratégicas</span>
              </div>
            </div>

            <div className="cantonal-metric-card orange">
              <div className="metric-icon-box">
                <Clock size={20} />
              </div>
              <div className="metric-info">
                <span className="metric-number">02</span>
                <span className="metric-label">Sin actividad 7d</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ZonasCriticas;