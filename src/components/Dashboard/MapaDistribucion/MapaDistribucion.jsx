import React, { useState, useEffect, useRef } from 'react';
import './MapaDistribucion.css';

const NIVEL_CONFIG = {
  'optimo': { color: '#10b981', bg: '#d1fae5', text: '#065f46', label: 'Óptimo' },
  'adecuado': { color: '#eab308', bg: '#fef9c3', text: '#a16207', label: 'Adecuado' },
  'regular': { color: '#f97316', bg: '#ffedd5', text: '#c2410c', label: 'Regular' },
  'insuficiente': { color: '#ef4444', bg: '#fee2e2', text: '#b91c1c', label: 'Requiere Refuerzo' },
};

export const MapaRiesgos = () => {
  const [data, setData] = useState([]);
  const [hoveredZona, setHoveredZona] = useState(null);
  const [hoveredLevel, setHoveredLevel] = useState(null);
  const panelRef = useRef(null); // REF PARA DETECTAR CLIC FUERA

  // LOGICA PARA CERRAR AL TOCAR CUALQUIER LADO
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setExpandedId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [activeZone, setActiveZone] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const svgRef = useRef(null);

  useEffect(() => {
    fetch('http://localhost:5000/distribucionPolicial')
      .then(res => res.json())
      .then(resData => {
        const organicConfig = {
          'puntarenas-centro': {
            path: 'M 10,210 L 80,205 Q 150,210 250,203 T 440,200 L 440,230 Q 250,240 150,235 T 10,230 Z',
            cx: 220, cy: 222
          },
          'chacarita': {
            path: 'M 440,200 Q 500,190 580,200 L 660,185 L 660,235 Q 580,245 440,230 Z',
            cx: 545, cy: 220
          },
          'el-roble': {
            path: 'M 660,185 Q 720,170 780,180 L 835,395 L 660,235 Z',
            cx: 735, cy: 235
          },
          'barranca': {
            path: 'M 780,180 Q 880,160 970,150 L 980,420 L 835,395 Z',
            cx: 890, cy: 195
          }
        };

        const transformed = (resData || []).map(d => {
          if (organicConfig[d.id]) {
            const v = organicConfig[d.id];
            return { ...d, path: v.path, cx: v.cx, cy: v.cy };
          }
          return d;
        });
        setData(transformed);
      })
      .catch(err => {
        console.error("Error cargando datos:", err);
        setData([]);
      });
  }, []);

  const totalOficiales = data.reduce((acc, current) => acc + (Number(current.oficiales) || 0), 0);
  const totalPatrullas = data.reduce((acc, current) => acc + (Number(current.patrullas) || 0), 0);
  const avgOficiales = (totalOficiales / (data.length || 1)).toFixed(1);
  
  // Estadísticas para gráficas
  const topZone = [...data].sort((a, b) => b.oficiales - a.oficiales)[0] || { nombre: 'N/A', oficiales: 0 };
  const criticalCount = data.filter(z => z.nivel === 'insuficiente').length;
  const maxOficialesVal = Math.max(...data.map(z => z.oficiales), 40);

  const handleMouseMove = (e, zona) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.closest('.map-canvas-container').getBoundingClientRect();
    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setHoveredZona(zona);
  };

  const handleZoneClick = (zona) => {
    setActiveZone(prev => prev?.id === zona.id ? null : zona);
    setExpandedId(prev => prev === zona.id ? null : zona.id);
  };

  return (
    <div className="mapa-distribucion">
      <header className="map-header">
        <div className="map-header__title">
          <h1>Distribución Policial</h1>
          <p>Supervisión estratégica de recursos en Puntarenas y distritos aledaños</p>
        </div>
        <div className="map-kpis">
          <div className="kpi-chip">
            <span className="kpi-chip__val">{totalOficiales}</span>
            <span className="kpi-chip__lbl">Oficiales Totales</span>
          </div>
          <div className="kpi-chip">
            <span className="kpi-chip__val">{totalPatrullas}</span>
            <span className="kpi-chip__lbl">Unidades Patrulla</span>
          </div>
        </div>
      </header>

      <div className="map-layout">
        <div className="map-main-content">
          <div className="map-canvas-container">
            <svg className="map-svg" viewBox="0 0 1000 650" xmlns="http://www.w3.org/2000/svg" ref={svgRef}>
              <rect width="1000" height="650" fill="#a3cf43" />
              <path d="M 0,230 Q 300,240 500,250 Q 700,260 800,450 Q 820,650 780,650 L 0,650 Z" fill="#7dd3fc" />
              <path d="M 0,200 Q 150,180 300,190 Q 450,200 600,160 L 1050,160 L 1050,0 L 0,0 Z" fill="#7dd3fc" />

              <g opacity="0.8">
                <path d="M 10,240 L 350,205 L 450,205 L 650,235 L 750,245 L 850,195 L 1000,95" stroke="#f59e0b" strokeWidth="5" fill="none" />
                <path d="M 740,245 L 760,405 L 850,555 L 980,650" stroke="#f59e0b" strokeWidth="4" fill="none" />
              </g>

              {/* Marcadores Geográficos Premium */}
              <g style={{ pointerEvents: 'none' }}>
                <text x="350" y="580" fill="#002f6c" fontSize="42" fontWeight="800" fontStyle="italic" opacity="0.85">Golfo de Nicoya</text>
                <text x="120" y="140" fill="#002f6c" fontSize="22" fontWeight="700" fontStyle="italic" opacity="0.7">Estero</text>
                <text x="180" y="380" fill="#000" fontSize="34" fontWeight="900" letterSpacing="2">PUNTARENAS</text>

                {/* Rosa de los Vientos */}
                {/* Rosa de los Vientos */}
                <g transform="translate(120, 510) scale(1.1)">
                  <circle cx="0" cy="0" r="45" fill="white" opacity="0.7" />
                  <path d="M 0,-35 L 12,0 L 0,35 L -12,0 Z" fill="#0b2240" />
                  <path d="M -35,0 L 0,12 L 35,0 L 0,-12 Z" fill="#0b2240" />
                  <text x="0" y="-40" textAnchor="middle" fontSize="14" fontWeight="900" fill="#0b2240">N</text>
                </g>

                {/* Escala Gráfica */}
                <g transform="translate(70, 585)">
                  <path d="M 0,-8 L 0,0 L 100,0 L 100,-8" fill="none" stroke="#000" strokeWidth="2" />
                  <text x="0" y="20" fontSize="11" fontWeight="800">0</text>
                  <text x="100" y="20" fontSize="11" fontWeight="800">1 KM</text>
                </g>

                {/* Rótulo de Río Barranca */}
                <text x="880" y="450" fill="#002f6c" fontSize="18" fontWeight="700" fontStyle="italic" opacity="0.75" transform="rotate(-60, 880, 450)">Rio Barranca</text>
              </g>

              {data.map(zona => {
                const cfg = NIVEL_CONFIG[zona.nivel] || { color: '#94a3b8', label: 'Sin Definir' };
                const isSelected = activeZone?.id === zona.id;
                const isHovered = hoveredZona?.id === zona.id;
                const isFiltered = searchTerm && !zona.nombre.toLowerCase().includes(searchTerm.toLowerCase());

                return (
                  <g key={zona.id} onClick={() => handleZoneClick(zona)} onMouseMove={(e) => handleMouseMove(e, zona)} onMouseLeave={() => setHoveredZona(null)} style={{ cursor: 'pointer' }}>
                    <path
                      d={zona.path}
                      fill={isHovered || (hoveredLevel === zona.nivel) ? '#ffff33' : '#ffff66'}
                      stroke={hoveredLevel === zona.nivel ? '#000' : '#854d0e'}
                      strokeWidth={isSelected || hoveredLevel === zona.nivel ? 6 : isHovered ? 4 : 2}
                      strokeLinejoin="round"
                      opacity={isFiltered ? 0.05 : (hoveredLevel && hoveredLevel !== zona.nivel ? 0.35 : 1)}
                      style={{ transition: 'all 0.4s ease' }}
                    />
                    <text x={zona.cx} y={zona.cy - 7} textAnchor="middle" fill="#1e293b" fontSize="14" fontWeight="800" opacity={isFiltered ? 0.1 : 1} style={{ pointerEvents: 'none', textTransform: 'uppercase' }}>
                      {zona.nombre}
                    </text>
                    <g style={{ pointerEvents: 'none', opacity: isFiltered ? 0.1 : 1 }}>
                      <rect x={zona.cx - 52} y={zona.cy + 4} width="104" height="18" rx="9" fill="white" stroke="#8d6e63" strokeWidth="1" opacity="0.9" />
                      <text x={zona.cx} y={zona.cy + 17} textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="800">
                        {zona.oficiales} Ofic. | {zona.patrullas} Patr.
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        <aside className="map-panel" ref={panelRef}>
          <div className="panel-header-top">
            <h3 className="panel-title">Estado de Distribución</h3>

            <div className="panel-search-box">
              <input type="text" placeholder="Buscar foco de atención..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>

          <div className="panel-items">
            {data.filter(z => z.nombre.toLowerCase().includes(searchTerm.toLowerCase())).map(zona => {
              const cfg = NIVEL_CONFIG[zona.nivel] || { color: '#94a3b8', label: 'Sin Definir' };
              const isExpanded = expandedId === zona.id;
              return (
                <div key={zona.id} className="zone-item-container">
                  <div className={`zone-item ${isExpanded ? 'active' : ''}`} onClick={() => handleZoneClick(zona)} style={{ borderLeftColor: cfg.color }}>
                    <div>
                      <div className="zone-item__name">{zona.nombre}</div>
                      <div className="zone-item__label" style={{ color: cfg.color }}>{cfg.label}</div>
                    </div>
                    <div className="zone-item__stats">
                      <div className="zone-item__count">{zona.oficiales}</div>
                      <div className="zone-item__label">Oficiales</div>
                    </div>
                    <span style={{ transition: 'all 0.3s', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', color: '#94a3b8', fontWeight: 'bold' }}>➔</span>
                  </div>
                  <div className={`zone-details ${isExpanded ? 'expanded' : ''}`}>
                    <div className="details-content">
                      <div className="detail-stat">
                        <span className="dot" style={{ background: cfg.color, width: 8, height: 8, borderRadius: '50%', display: 'inline-block' }} />
                        <strong>Patrullas:</strong> {zona.patrullas} unidades
                      </div>
                      <div className="detail-recommendation">
                        {zona.nivel === 'insuficiente' ? 'Se requiere refuerzo inmediato de personal.' :
                          zona.nivel === 'optimo' ? 'Distribución eficiente.' : 'Mantener vigilancia constante.'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      </div>

      <div className="map-info-panel-container">
        <div className="analytics-card">
          <div className="map-legend-elegant horizontal-centered micro-bar">
            <div className="legend-items-row">
              <span className="micro-label">COBERTURA:</span>
              {Object.entries(NIVEL_CONFIG).map(([key, cfg]) => (
                <div key={key} className={`legend-chip interactive ${hoveredLevel === key ? 'active' : ''}`} onMouseEnter={() => setHoveredLevel(key)} onMouseLeave={() => setHoveredLevel(null)}>
                  <span className="dot" style={{ background: cfg.color }} /> {cfg.label}
                </div>
              ))}
              <div className="legend-divider-vertical" />
              <div className="legend-extra-stat">
                 Promedio: <strong>{avgOficiales}</strong> ofic/sector
              </div>
            </div>
          </div>

          <section className="map-analytics">
            <div className="analytics-header">
              <h3>Análisis Comparativo de Personal</h3>
              <p>Distribución de oficiales por sector administrativo</p>
            </div>
            <div className="analytics-grid">
              {/* Gráfica de Barras Local */}
              <div className="bars-container">
                {data.map(zona => (
                  <div key={zona.id} className="bar-item">
                    <div className="bar-label">{zona.nombre}</div>
                    <div className="bar-track">
                      <div 
                        className="bar-fill" 
                        style={{ 
                          width: `${(zona.oficiales / maxOficialesVal) * 100}%`,
                          background: (NIVEL_CONFIG[zona.nivel] || {}).color 
                        }}
                      >
                        <span className="bar-value">{zona.oficiales}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* KPIs de Resumen */}
              <div className="analytics-summary">
                <div className="summary-box">
                  <span className="summary-title">Sector Mayor Reforzado</span>
                  <span className="summary-value">{topZone.nombre}</span>
                  <span className="summary-desc">{topZone.oficiales} oficiales asignados</span>
                </div>
                <div className="summary-box alert">
                  <span className="summary-title">Sectores en Estado Crítico</span>
                  <span className="summary-value" style={{ color: '#ef4444' }}>{criticalCount}</span>
                  <span className="summary-desc">Requieren atención inmediata</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {hoveredZona && (
        <div className="map-tooltip" style={{ left: tooltipPos.x + 20, top: tooltipPos.y - 120 }}>
          <div className="tooltip-title">{hoveredZona.nombre}</div>
          <div className="tooltip-stat" style={{ color: (NIVEL_CONFIG[hoveredZona.nivel] || {}).color || '#ef4444' }}>
            Cobertura {(NIVEL_CONFIG[hoveredZona.nivel] || {}).label || 'N/A'}
          </div>
          <div className="tooltip-stat">{hoveredZona.oficiales} oficiales</div>
          <div className="tooltip-stat">{hoveredZona.patrullas} patrullas</div>
        </div>
      )}
    </div>
  );
};

export default MapaRiesgos;
