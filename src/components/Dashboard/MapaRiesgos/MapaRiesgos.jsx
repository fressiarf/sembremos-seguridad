import React, { useState, useEffect, useRef } from 'react';
import './MapaRiesgos.css';

// ─────────────────────────────────────────────────────────
//  DATOS DE CANTONES — Provincia de Puntarenas (11 cantones)
// ─────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────
//  DATOS DE CANTONES — Provincia de Puntarenas (12 cantones)
// ─────────────────────────────────────────────────────────
const CANTONES_DATA = [
  {
    id: 'puntarenas',
    nombre: 'Puntarenas',
    nivel: 'critico',
    incidentes: 87,
    alertas: 14,
    oficiales: 32,
    tendencia: 'up',
    descripcion: 'Puerto Central · Archipiélago del Golfo',
    // Mainland + Peninsula parts
    path: 'M 100,140 L 160,120 L 190,150 L 170,180 L 110,170 Z M 30,160 L 70,140 L 90,190 L 50,220 Z',
    cx: 145, cy: 155,
  },
  {
    id: 'esparza',
    nombre: 'Esparza',
    nivel: 'alto',
    incidentes: 54,
    alertas: 9,
    oficiales: 18,
    tendencia: 'up',
    descripcion: 'Acceso vía Ruta 1 · Zona industrial',
    path: 'M 190,150 L 250,130 L 270,160 L 230,190 L 190,180 Z',
    cx: 230, cy: 165,
  },
  {
    id: 'montes-oro',
    nombre: 'Montes de Oro',
    nivel: 'moderado',
    incidentes: 31,
    alertas: 5,
    oficiales: 12,
    tendencia: 'stable',
    descripcion: 'Zona montañosa · Miramar',
    path: 'M 210,100 L 260,90 L 280,120 L 230,135 Z',
    cx: 245, cy: 110,
  },
  {
    id: 'aguirre',
    nombre: 'Quepos',
    nivel: 'alto',
    incidentes: 62,
    alertas: 11,
    oficiales: 20,
    tendencia: 'up',
    descripcion: 'Turismo · Parque Manuel Antonio',
    path: 'M 320,290 L 370,270 L 410,330 L 350,370 Z',
    cx: 375, cy: 320,
  },
  {
    id: 'parrita',
    nombre: 'Parrita',
    nivel: 'moderado',
    incidentes: 28,
    alertas: 4,
    oficiales: 10,
    tendencia: 'down',
    descripcion: 'Planicie costera · Zona agrícola',
    path: 'M 280,240 L 330,220 L 360,260 L 310,290 Z',
    cx: 325, cy: 260,
  },
  {
    id: 'corredores',
    nombre: 'Corredores',
    nivel: 'alto',
    incidentes: 58,
    alertas: 10,
    oficiales: 22,
    tendencia: 'stable',
    descripcion: 'Frontera sur · Paso Canoas',
    path: 'M 650,580 L 720,540 L 760,630 L 680,680 Z',
    cx: 710, cy: 620,
  },
  {
    id: 'osa',
    nombre: 'Osa',
    nivel: 'moderado',
    incidentes: 35,
    alertas: 6,
    oficiales: 14,
    tendencia: 'down',
    descripcion: 'Península de Osa · Biodiversidad',
    path: 'M 410,380 L 530,340 L 580,450 L 530,580 L 420,620 L 360,450 Z',
    cx: 470, cy: 490,
  },
  {
    id: 'golfito',
    nombre: 'Golfito',
    nivel: 'critico',
    incidentes: 45,
    alertas: 8,
    oficiales: 16,
    tendencia: 'up',
    descripcion: 'Depósito Libre · Zona portuaria sur',
    path: 'M 530,580 L 580,450 L 650,480 L 690,640 L 600,690 Z',
    cx: 610, cy: 580,
  },
  {
    id: 'buenos-aires',
    nombre: 'Buenos Aires',
    nivel: 'bajo',
    incidentes: 18,
    alertas: 2,
    oficiales: 8,
    tendencia: 'down',
    descripcion: 'Zona indígena · Valle del General',
    path: 'M 530,340 L 660,310 L 700,420 L 580,450 Z',
    cx: 620, cy: 380,
  },
  {
    id: 'coto-brus',
    nombre: 'Coto Brus',
    nivel: 'bajo',
    incidentes: 22,
    alertas: 3,
    oficiales: 9,
    tendencia: 'stable',
    descripcion: 'Zona cafetalera · Limítrofe',
    path: 'M 660,420 L 750,390 L 780,490 L 690,520 Z',
    cx: 730, cy: 450,
  },
  {
    id: 'garabito',
    nombre: 'Garabito',
    nivel: 'moderado',
    incidentes: 40,
    alertas: 7,
    oficiales: 15,
    tendencia: 'up',
    descripcion: 'Jacó · Polo turístico',
    path: 'M 240,195 L 300,180 L 330,225 L 270,250 Z',
    cx: 290, cy: 220,
  },
  {
    id: 'monteverde',
    nombre: 'Monteverde',
    nivel: 'bajo',
    incidentes: 12,
    alertas: 1,
    oficiales: 6,
    tendencia: 'down',
    descripcion: 'Reserva forestal · Ecoturismo',
    path: 'M 160,80 L 220,70 L 240,105 L 180,115 Z',
    cx: 205, cy: 95,
  },
];

const NIVEL_CONFIG = {
  critico: { color: '#ef4444', glow: 'rgba(239,68,68,0.5)', label: 'Crítico', dark: '#b91c1c', light: '#fee2e2' },
  alto:    { color: '#f97316', glow: 'rgba(249,115,22,0.4)', label: 'Alto',    dark: '#c2410c', light: '#ffedd5' },
  moderado:{ color: '#eab308', glow: 'rgba(234,179,8,0.4)',  label: 'Moderado',dark: '#a16207', light: '#fef9c3' },
  bajo:    { color: '#22c55e', glow: 'rgba(34,197,94,0.4)',  label: 'Bajo',    dark: '#15803d', light: '#dcfce7' },
};

const FILTROS = ['todos', 'critico', 'alto', 'moderado', 'bajo'];

// ─────────────────────────────────────────────────────────
//  Íconos
// ─────────────────────────────────────────────────────────
const Icon = {
  TrendUp: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  TrendDown: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" />
    </svg>
  ),
  TrendStable: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Shield: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Alert: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  Users: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  Map: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  ),
};

// ─────────────────────────────────────────────────────────
//  Componente Principal
// ─────────────────────────────────────────────────────────
const MapaRiesgos = () => {
  const [hoveredCanton, setHoveredCanton]     = useState(null);
  const [selectedCanton, setSelectedCanton]   = useState(null);
  const [filtroActivo, setFiltroActivo]       = useState('todos');
  const [tooltipPos, setTooltipPos]           = useState({ x: 0, y: 0 });
  const [animateIn, setAnimateIn]             = useState(false);
  const svgRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setAnimateIn(true), 100);
    return () => clearTimeout(t);
  }, []);

  const cantonesFiltrados = CANTONES_DATA.filter(c =>
    filtroActivo === 'todos' || c.nivel === filtroActivo
  );

  const totalIncidentes = CANTONES_DATA.reduce((s, c) => s + c.incidentes, 0);
  const criticos  = CANTONES_DATA.filter(c => c.nivel === 'critico').length;
  const altos     = CANTONES_DATA.filter(c => c.nivel === 'alto').length;

  const ordenados = [...CANTONES_DATA].sort((a, b) => b.incidentes - a.incidentes);

  const handleMouseMove = (e, canton) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.closest('.mapa-riesgos__canvas-wrapper').getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setHoveredCanton(canton);
  };

  const handleCantonClick = (canton) => {
    setSelectedCanton(prev => prev?.id === canton.id ? null : canton);
  };

  const TrendIcon = ({ t }) => {
    if (t === 'up')   return <span className="trend trend--up"><Icon.TrendUp /></span>;
    if (t === 'down') return <span className="trend trend--down"><Icon.TrendDown /></span>;
    return <span className="trend trend--stable"><Icon.TrendStable /></span>;
  };

  return (
    <div className={`mapa-riesgos ${animateIn ? 'mapa-riesgos--visible' : ''}`}>

      {/* ── Header ── */}
      <header className="mapa-riesgos__header">
        <div className="mapa-riesgos__title-block">
          <div className="mapa-riesgos__title-icon"><Icon.Map /></div>
          <div>
            <h1>Mapa de Riesgos</h1>
            <p>Provincia de Puntarenas · 12 Cantones · Tiempo real</p>
          </div>
        </div>
        <div className="mapa-riesgos__kpis">
          <div className="mapa-kpi mapa-kpi--red">
            <span className="mapa-kpi__val">{criticos}</span>
            <span className="mapa-kpi__lbl">Críticos</span>
          </div>
          <div className="mapa-kpi mapa-kpi--orange">
            <span className="mapa-kpi__val">{altos}</span>
            <span className="mapa-kpi__lbl">Alto riesgo</span>
          </div>
          <div className="mapa-kpi mapa-kpi--blue">
            <span className="mapa-kpi__val">{totalIncidentes}</span>
            <span className="mapa-kpi__lbl">Incidentes totales</span>
          </div>
        </div>
      </header>

      {/* ── Filtros ── */}
      <div className="mapa-riesgos__filtros">
        {FILTROS.map(f => (
          <button
            key={f}
            className={`filtro-btn ${filtroActivo === f ? 'filtro-btn--active' : ''} ${f !== 'todos' ? `filtro-btn--${f}` : ''}`}
            onClick={() => setFiltroActivo(f)}
          >
            {f === 'todos' ? 'Todos los cantones' : NIVEL_CONFIG[f]?.label}
          </button>
        ))}
      </div>

      {/* ── Cuerpo principal ── */}
      <div className="mapa-riesgos__body">

        {/* ── Canvas 3D del mapa ── */}
        <div className="mapa-riesgos__map-col">
          <div className="mapa-riesgos__canvas-wrapper" ref={svgRef}>

            {/* Sombra 3D extrudida */}
            <div className="mapa-riesgos__extrude-shadow" />

            {/* SVG principal */}
            <svg
              className="mapa-riesgos__svg"
              viewBox="0 0 800 700"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Filtros SVG */}
              <defs>
                <filter id="glow-critico" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glow-alto" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <radialGradient id="ocean-bg" cx="50%" cy="50%" r="70%">
                  <stop offset="0%" stopColor="#e0f2fe" />
                  <stop offset="100%" stopColor="#bae6fd" />
                </radialGradient>

                {/* Gradientes por cantón */}
                {CANTONES_DATA.map(c => {
                  const cfg = NIVEL_CONFIG[c.nivel];
                  return (
                    <radialGradient key={c.id} id={`grad-${c.id}`} cx="40%" cy="35%" r="65%">
                      <stop offset="0%" stopColor={cfg.color} stopOpacity="1" />
                      <stop offset="100%" stopColor={cfg.dark} stopOpacity="0.9" />
                    </radialGradient>
                  );
                })}
              </defs>

              {/* Fondo oceánico */}
              <rect x="0" y="0" width="800" height="700" fill="url(#ocean-bg)" rx="16" />

              {/* Olas decorativas */}
              <path d="M0,580 Q200,550 400,575 Q600,600 800,570 L800,700 L0,700 Z"
                fill="rgba(186,230,253,0.5)" />
              <path d="M0,610 Q150,590 350,608 Q550,628 800,600 L800,700 L0,700 Z"
                fill="rgba(147,210,240,0.35)" />

              {/* Línea costera decorativa */}
              <path d="M80,150 Q120,130 160,155 Q200,180 170,220 Q140,260 165,300 Q195,340 180,380 Q165,420 180,460 Q195,500 220,530"
                fill="none" stroke="rgba(14,165,233,0.3)" strokeWidth="3" strokeDasharray="8 4" />

              {/* Label "Océano Pacífico" */}
              <text x="90" y="580" fill="rgba(14,165,233,0.5)"
                fontSize="13" fontStyle="italic" fontFamily="Inter,sans-serif">Océano Pacífico</text>

              {/* Rosa de los vientos */}
              <g transform="translate(720, 80)">
                <circle cx="0" cy="0" r="28" fill="rgba(255,255,255,0.7)" stroke="rgba(0,47,108,0.15)" strokeWidth="1.5" />
                <text x="0" y="-14" textAnchor="middle" fontSize="9" fill="#1e293b" fontWeight="700" fontFamily="Inter,sans-serif">N</text>
                <text x="0" y="20"  textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="600" fontFamily="Inter,sans-serif">S</text>
                <text x="18" y="4"  textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="600" fontFamily="Inter,sans-serif">E</text>
                <text x="-18" y="4" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="600" fontFamily="Inter,sans-serif">O</text>
                <line x1="0" y1="-22" x2="0" y2="22" stroke="rgba(0,47,108,0.2)" strokeWidth="1" />
                <line x1="-22" y1="0" x2="22" y2="0" stroke="rgba(0,47,108,0.2)" strokeWidth="1" />
                <polygon points="0,-10 3,-4 -3,-4" fill="#002f6c" />
              </g>

              {/* ── Sombra extrudida de cada cantón (efecto 3D) ── */}
              {CANTONES_DATA.map(c => {
                const cfg = NIVEL_CONFIG[c.nivel];
                const isFiltered = filtroActivo !== 'todos' && c.nivel !== filtroActivo;
                return (
                  <path
                    key={`shadow-${c.id}`}
                    d={c.path}
                    fill={cfg.dark}
                    opacity={isFiltered ? 0.05 : 0.35}
                    transform="translate(6,8)"
                  />
                );
              })}

              {/* ── Cantones ── */}
              {CANTONES_DATA.map(c => {
                const cfg = NIVEL_CONFIG[c.nivel];
                const isHovered  = hoveredCanton?.id === c.id;
                const isSelected = selectedCanton?.id === c.id;
                const isFiltered = filtroActivo !== 'todos' && c.nivel !== filtroActivo;

                return (
                  <g key={c.id} className={`canton-group ${c.nivel === 'critico' ? 'canton-group--pulse' : ''}`}>
                    {/* Glow halo */}
                    {(isHovered || isSelected) && !isFiltered && (
                      <path
                        d={c.path}
                        fill={cfg.glow}
                        filter={`url(#glow-${c.nivel === 'critico' ? 'critico' : 'alto'})`}
                        transform={isHovered ? 'translate(-2,-3) scale(1.02)' : ''}
                        style={{ transformOrigin: `${c.cx}px ${c.cy}px` }}
                      />
                    )}

                    {/* Forma principal */}
                    <path
                      d={c.path}
                      fill={isFiltered ? '#e2e8f0' : `url(#grad-${c.id})`}
                      stroke={isFiltered ? '#cbd5e1' : (isSelected ? '#fff' : cfg.color)}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      opacity={isFiltered ? 0.3 : 1}
                      transform={isHovered && !isFiltered ? 'translate(-2,-4)' : ''}
                      style={{
                        cursor: isFiltered ? 'default' : 'pointer',
                        filter: isHovered && !isFiltered
                          ? `drop-shadow(0 8px 16px ${cfg.glow})`
                          : isSelected && !isFiltered
                          ? `drop-shadow(0 4px 8px ${cfg.glow})`
                          : 'none',
                        transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      }}
                      onMouseMove={!isFiltered ? (e) => handleMouseMove(e, c) : undefined}
                      onMouseLeave={() => setHoveredCanton(null)}
                      onClick={!isFiltered ? () => handleCantonClick(c) : undefined}
                    />

                    {/* Etiqueta del cantón */}
                    {!isFiltered && (
                      <text
                        x={c.cx}
                        y={c.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={isHovered ? "10.5" : "9.5"}
                        fontWeight="700"
                        fill="#fff"
                        fontFamily="Inter,sans-serif"
                        style={{
                          pointerEvents: 'none',
                          filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.5))',
                          transition: 'font-size 0.2s ease',
                        }}
                      >
                        {c.nombre}
                      </text>
                    )}

                    {/* Punto de alerta para críticos */}
                    {c.nivel === 'critico' && !isFiltered && (
                      <circle
                        cx={c.cx}
                        cy={c.cy - 22}
                        r="5"
                        fill="#fff"
                        stroke={cfg.color}
                        strokeWidth="2"
                        className="alerta-pulse"
                        style={{ pointerEvents: 'none' }}
                      />
                    )}
                  </g>
                );
              })}

              {/* Título del mapa */}
              <text x="400" y="36" textAnchor="middle"
                fontSize="14" fontWeight="700" fill="rgba(0,47,108,0.6)"
                fontFamily="Inter,sans-serif" letterSpacing="2">
                PROVINCIA DE PUNTARENAS
              </text>
            </svg>

            {/* ── Tooltip flotante ── */}
            {hoveredCanton && (
              <div
                className="mapa-tooltip"
                style={{ left: tooltipPos.x + 16, top: tooltipPos.y - 10 }}
              >
                <div className="mapa-tooltip__header"
                  style={{ borderColor: NIVEL_CONFIG[hoveredCanton.nivel].color }}>
                  <span className="mapa-tooltip__dot"
                    style={{ background: NIVEL_CONFIG[hoveredCanton.nivel].color,
                             boxShadow: `0 0 8px ${NIVEL_CONFIG[hoveredCanton.nivel].glow}` }} />
                  <strong>{hoveredCanton.nombre}</strong>
                  <span className="mapa-tooltip__nivel"
                    style={{ background: NIVEL_CONFIG[hoveredCanton.nivel].light,
                             color: NIVEL_CONFIG[hoveredCanton.nivel].dark }}>
                    {NIVEL_CONFIG[hoveredCanton.nivel].label}
                  </span>
                </div>
                <p className="mapa-tooltip__desc">{hoveredCanton.descripcion}</p>
                <div className="mapa-tooltip__stats">
                  <div className="mapa-tooltip__stat">
                    <Icon.Alert />
                    <span>{hoveredCanton.incidentes} Incidentes</span>
                  </div>
                  <div className="mapa-tooltip__stat">
                    <Icon.Shield />
                    <span>{hoveredCanton.alertas} Alertas</span>
                  </div>
                  <div className="mapa-tooltip__stat">
                    <Icon.Users />
                    <span>{hoveredCanton.oficiales} Oficiales</span>
                  </div>
                </div>
              </div>
            )}

            {/* ── Leyenda ── */}
            <div className="mapa-leyenda">
              {Object.entries(NIVEL_CONFIG).map(([key, cfg]) => (
                <div key={key} className="mapa-leyenda__item">
                  <span className="mapa-leyenda__dot" style={{ background: cfg.color,
                    boxShadow: `0 0 6px ${cfg.glow}` }} />
                  <span>{cfg.label}</span>
                </div>
              ))}
            </div>

          </div>

          {/* ── Detalle del cantón seleccionado — FUERA del wrapper 3D para evitar recortes ── */}
          {selectedCanton && (
            <div className="panel-detalle"
              style={{ borderColor: NIVEL_CONFIG[selectedCanton.nivel].color }}>
              <div className="panel-detalle__title"
                style={{ color: NIVEL_CONFIG[selectedCanton.nivel].dark }}>
                {selectedCanton.nombre}
              </div>
              <p className="panel-detalle__desc">{selectedCanton.descripcion}</p>
              <div className="panel-detalle__grid">
                <div className="panel-detalle__cell">
                  <span className="panel-detalle__val" style={{ color: NIVEL_CONFIG[selectedCanton.nivel].color }}>
                    {selectedCanton.incidentes}
                  </span>
                  <span className="panel-detalle__key">Incidentes</span>
                </div>
                <div className="panel-detalle__cell">
                  <span className="panel-detalle__val">{selectedCanton.alertas}</span>
                  <span className="panel-detalle__key">Alertas</span>
                </div>
                <div className="panel-detalle__cell">
                  <span className="panel-detalle__val">{selectedCanton.oficiales}</span>
                  <span className="panel-detalle__key">Oficiales</span>
                </div>
              </div>
              <button className="panel-detalle__close"
                onClick={() => setSelectedCanton(null)}>
                Cerrar detalle ×
              </button>
            </div>
          )}
        </div>

        {/* ── Panel lateral ── */}
        <aside className="mapa-riesgos__panel">
          <div className="panel-header">
            <h3>Ranking de Riesgo</h3>
            <span className="panel-badge">{CANTONES_DATA.length} cantones</span>
          </div>

          <div className="panel-list">
            {ordenados.map((c, i) => {
              const cfg = NIVEL_CONFIG[c.nivel];
              const isSelected = selectedCanton?.id === c.id;
              return (
                <div
                  key={c.id}
                  className={`panel-item ${isSelected ? 'panel-item--selected' : ''}`}
                  style={{ borderLeftColor: cfg.color }}
                  onClick={() => handleCantonClick(c)}
                >
                  <div className="panel-item__rank"
                    style={{ background: i < 3 ? cfg.light : '#f8fafc',
                             color: i < 3 ? cfg.dark : '#64748b' }}>
                    {i + 1}
                  </div>
                  <div className="panel-item__info">
                    <div className="panel-item__name">{c.nombre}</div>
                    <div className="panel-item__meta">
                      <span className="nivel-badge"
                        style={{ background: cfg.light, color: cfg.dark }}>
                        {cfg.label}
                      </span>
                      <TrendIcon t={c.tendencia} />
                    </div>
                  </div>
                  <div className="panel-item__stats">
                    <span className="panel-item__inc" style={{ color: cfg.color }}>
                      {c.incidentes}
                    </span>
                    <span className="panel-item__inc-lbl">inc.</span>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

      </div>
    </div>
  );
};

export default MapaRiesgos;
