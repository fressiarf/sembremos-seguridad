import React, { useState } from 'react';
import './SidebarAdmin.css';

// ──────────────────────────────────────────────
//  Íconos SVG inline (sin dependencias externas)
// ──────────────────────────────────────────────
const Icon = {
  Dashboard: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  Users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Activity: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  Matrix: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" />
      <line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" />
    </svg>
  ),
  Zone: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Report: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  Alert: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  Map: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  ),
  Stats: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  ),
  Settings: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  Logout: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Chevron: ({ open }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease' }}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  Shield: () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Bell: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  Incident: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  Calendar: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
};

// ──────────────────────────────────────────────
//  Estructura de navegación
// ──────────────────────────────────────────────
const NAV_SECTIONS = [
  {
    label: 'PRINCIPAL',
    items: [
      { id: 'dashboard',   label: 'Dashboard global',      icon: Icon.Dashboard, path: '/dashboard' },
      { id: 'actividades', label: 'Actividad oficiales',   icon: Icon.Activity,  path: '/actividades', badge: 3 },
    ],
  },
  {
    label: 'GESTIÓN',
    items: [
      { id: 'matrices',    label: 'Todas las matrices',    icon: Icon.Matrix,    path: '/matrices' },
      { id: 'zonas',       label: 'Zonas críticas',        icon: Icon.Zone,      path: '/zonas',    badge: 2 },
      { id: 'incidentes',  label: 'Incidentes',            icon: Icon.Incident,  path: '/incidentes' },
      { id: 'alertas',     label: 'Alertas activas',       icon: Icon.Alert,     path: '/alertas',  badge: 5 },
    ],
  },
  {
    label: 'ANÁLISIS',
    items: [
      { id: 'mapa',        label: 'Mapa de riesgos',       icon: Icon.Map,       path: '/mapa' },
      { id: 'estadisticas',label: 'Estadísticas',          icon: Icon.Stats,     path: '/estadisticas' },
      { id: 'calendario',  label: 'Calendario',            icon: Icon.Calendar,  path: '/calendario' },
    ],
  },
  {
    label: 'ADMINISTRACIÓN',
    items: [
      { id: 'usuarios',    label: 'Gestión de usuarios',   icon: Icon.Users,     path: '/usuarios' },
      { id: 'reportes',    label: 'Reportes INL/MSP',      icon: Icon.Report,    path: '/reportes' },
      { id: 'configuracion',label: 'Configuración',        icon: Icon.Settings,  path: '/configuracion' },
    ],
  },
];

// ──────────────────────────────────────────────
//  Componente principal
// ──────────────────────────────────────────────
const SidebarAdmin = ({ collapsed = false, onToggle, activeView, onViewChange }) => {
  const [openSections, setOpenSections] = useState({
    PRINCIPAL: true, GESTIÓN: true, ANÁLISIS: true, ADMINISTRACIÓN: true,
  });

  const toggleSection = (label) => {
    setOpenSections(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside className={`sidebar-admin ${collapsed ? 'sidebar-admin--collapsed' : ''}`}>

      {/* ── Encabezado institucional ── */}
      <div className="sidebar-admin__header">
        <div className="sidebar-admin__logo">
          <div className="sidebar-admin__logo-icon">
            <Icon.Shield />
          </div>
          {!collapsed && (
            <div className="sidebar-admin__logo-text">
              <span className="sidebar-admin__logo-title">Sembremos</span>
              <span className="sidebar-admin__logo-subtitle">Seguridad</span>
              <span className="sidebar-admin__logo-location">Puntarenas · 2025</span>
            </div>
          )}
        </div>

        {/* Botón colapsar */}
        <button className="sidebar-admin__toggle" onClick={onToggle} title={collapsed ? 'Expandir' : 'Colapsar'}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: collapsed ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }}>
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {/* ── Rol del usuario ── */}
      {!collapsed && (
        <div className="sidebar-admin__role">
          <span className="sidebar-admin__role-dot" />
          <span className="sidebar-admin__role-label">Administrador</span>
        </div>
      )}

      {/* ── Navegación ── */}
      <nav className="sidebar-admin__nav">
        {NAV_SECTIONS.map(section => (
          <div key={section.label} className="sidebar-admin__section">

            {/* Título de sección */}
            {!collapsed && (
              <button
                className="sidebar-admin__section-title"
                onClick={() => toggleSection(section.label)}
              >
                <span>{section.label}</span>
                <span className="sidebar-admin__section-chevron">
                  <Icon.Chevron open={openSections[section.label]} />
                </span>
              </button>
            )}

            {/* Ítems */}
            <ul className={`sidebar-admin__list ${!collapsed && !openSections[section.label] ? 'sidebar-admin__list--hidden' : ''}`}>
              {section.items.map(item => {
                const IconComp = item.icon;
                const isActive = activeView === item.id;
                return (
                  <li key={item.id}>
                    <button
                      id={`nav-${item.id}`}
                      className={`sidebar-admin__item ${isActive ? 'sidebar-admin__item--active' : ''}`}
                      onClick={() => onViewChange(item.id)}
                      title={collapsed ? item.label : undefined}
                    >
                      {/* Indicador activo */}
                      {isActive && <span className="sidebar-admin__item-indicator" />}

                      {/* Ícono */}
                      <span className="sidebar-admin__item-icon">
                        <IconComp />
                      </span>

                      {/* Etiqueta */}
                      {!collapsed && (
                        <span className="sidebar-admin__item-label">{item.label}</span>
                      )}

                      {/* Badge */}
                      {item.badge && (
                        <span className={`sidebar-admin__badge ${collapsed ? 'sidebar-admin__badge--dot' : ''}`}>
                          {!collapsed && item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* ── Footer: perfil + cerrar sesión ── */}
      <div className="sidebar-admin__footer">
        <div className="sidebar-admin__profile">
          <div className="sidebar-admin__avatar">CA</div>
          {!collapsed && (
            <div className="sidebar-admin__profile-info">
              <span className="sidebar-admin__profile-name">C. Araya</span>
              <span className="sidebar-admin__profile-role">Administrador</span>
            </div>
          )}
        </div>

        <a href="/" className="sidebar-admin__logout" title="Cerrar sesión" id="btn-logout" style={{ textDecoration: 'none' }}>
          <Icon.Logout />
          {!collapsed && <span>Cerrar sesión</span>}
        </a>
      </div>
    </aside>
  );
};

export default SidebarAdmin;
