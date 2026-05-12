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

      {/* ── MAPA DE CALOR SVG ── */}
      <div className="heatmap-container">
        <div className="heatmap-header">
          <h3 className="heatmap-title">Mapa de Calor — Nivel de Riesgo por Distrito</h3>
          <div className="heatmap-legend">
            <span className="legend-item"><span className="legend-dot" style={{background:'#ef4444'}}></span>Crítico</span>
            <span className="legend-item"><span className="legend-dot" style={{background:'#f97316'}}></span>Alto</span>
            <span className="legend-item"><span className="legend-dot" style={{background:'#eab308'}}></span>Medio</span>
            <span className="legend-item"><span className="legend-dot" style={{background:'#22c55e'}}></span>Bajo</span>
          </div>
        </div>
        <svg className="heatmap-svg" viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Gradientes de calor radial por zona */}
            {zonas.map(z => {
              const nivelColor = {
                'Crítico': ['#ef4444', 'rgba(239,68,68,0.15)'],
                'Alto': ['#f97316', 'rgba(249,115,22,0.15)'],
                'Medio': ['#eab308', 'rgba(234,179,8,0.12)'],
                'Bajo': ['#22c55e', 'rgba(34,197,94,0.1)'],
              };
              const [inner, outer] = nivelColor[z.nivel] || ['#94a3b8', 'rgba(148,163,184,0.1)'];
              return (
                <radialGradient key={`grad-${z.id}`} id={`heat-${z.id}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={inner} stopOpacity="0.7" />
                  <stop offset="60%" stopColor={inner} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={outer} stopOpacity="0" />
                </radialGradient>
              );
            })}
          </defs>

          {/* Fondo del mapa */}
          <rect width="1000" height="500" fill="#f0f9ff" rx="12" />
          {/* Mar / Golfo */}
          <path d="M 0,330 Q 300,340 500,350 Q 700,360 800,450 Q 820,500 780,500 L 0,500 Z" fill="#bae6fd" opacity="0.5" />
          <path d="M 0,180 Q 150,160 300,170 Q 450,180 600,140 L 1050,140 L 1050,0 L 0,0 Z" fill="#bae6fd" opacity="0.4" />
          <text x="350" y="460" fill="#0369a1" fontSize="32" fontWeight="800" fontStyle="italic" opacity="0.3">Golfo de Nicoya</text>

          {/* Carreteras */}
          <path d="M 10,240 L 350,205 L 450,205 L 650,235 L 750,245 L 850,195 L 1000,95" stroke="#94a3b8" strokeWidth="2" fill="none" strokeDasharray="6,4" opacity="0.5" />

          {/* Zonas geográficas con color de riesgo */}
          {(() => {
            const geoData = [
              { nombre: 'Puntarenas Centro', path: 'M 10,210 L 80,205 Q 150,210 250,203 T 440,200 L 440,230 Q 250,240 150,235 T 10,230 Z', cx: 220, cy: 218 },
              { nombre: 'Chacarita', path: 'M 440,200 Q 500,190 580,200 L 660,185 L 660,235 Q 580,245 440,230 Z', cx: 545, cy: 215 },
              { nombre: 'El Roble', path: 'M 660,185 Q 720,170 780,180 L 835,350 L 660,235 Z', cx: 730, cy: 240 },
              { nombre: 'Barranca', path: 'M 780,180 Q 880,160 970,150 L 980,380 L 835,350 Z', cx: 885, cy: 210 },
              { nombre: 'El Carmen', path: 'M 150,260 Q 200,270 280,265 Q 340,260 380,270 L 380,320 Q 280,330 150,310 Z', cx: 265, cy: 290 },
            ];

            const nivelFill = {
              'Crítico': '#ef4444',
              'Alto': '#f97316',
              'Medio': '#eab308',
              'Bajo': '#22c55e',
            };

            return geoData.map(geo => {
              const zonaData = zonas.find(z => z.nombre === geo.nombre);
              if (!zonaData) return null;
              const fillColor = nivelFill[zonaData.nivel] || '#94a3b8';
              const incidentes = zonaData.incidentes || 0;
              const heatRadius = Math.min(120, 40 + incidentes * 5);

              return (
                <g key={geo.nombre}>
                  {/* Forma del distrito coloreada */}
                  <path
                    d={geo.path}
                    fill={fillColor}
                    opacity="0.35"
                    stroke={fillColor}
                    strokeWidth="2"
                    style={{ transition: 'all 0.4s' }}
                  />
                  {/* Gradiente de calor basado en incidentes */}
                  <circle
                    cx={geo.cx}
                    cy={geo.cy}
                    r={heatRadius}
                    fill={`url(#heat-${zonaData.id})`}
                    style={{ transition: 'r 0.5s' }}
                  />
                  {/* Label */}
                  <text x={geo.cx} y={geo.cy - 12} textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="800" style={{ textTransform: 'uppercase' }}>
                    {geo.nombre}
                  </text>
                  {/* Badge de incidentes */}
                  <rect x={geo.cx - 28} y={geo.cy} width="56" height="20" rx="10" fill="white" stroke={fillColor} strokeWidth="1.5" opacity="0.95" />
                  <text x={geo.cx} y={geo.cy + 14} textAnchor="middle" fill={fillColor} fontSize="10" fontWeight="800">
                    {incidentes} incid.
                  </text>
                </g>
              );
            });
          })()}
        </svg>
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