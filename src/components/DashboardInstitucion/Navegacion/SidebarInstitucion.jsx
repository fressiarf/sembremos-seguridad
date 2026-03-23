import React, { useState } from 'react';
import '../../Dashboard/SidebarAdmin/SidebarAdmin.css';
import { useLogin } from "../../../context/LoginContext";
import UserBrand from "./UserBrand";
import { ChevronLeft, ChevronDown, LayoutDashboard, Activity, Clock, LogOut, User, MapPin, Calendar } from "lucide-react";

const SidebarInstitucion = ({ collapsed = false, onToggle, activeView, onViewChange }) => {
  const { logout } = useLogin();
  const [openSections, setOpenSections] = useState({
    OPERATIVO: true, GESTIÓN: true,
  });

  // ── Secciones de navegación para el Oficial ──
  const navSections = [
    {
      label: 'OPERATIVO',
      items: [
        { id: 'dashboard',   label: 'Dashboard',              icon: LayoutDashboard },
        { id: 'lineas',      label: 'Mis Tareas',             icon: Activity },
      ],
    },
    {
      label: 'GESTIÓN',
      items: [
        { id: 'historial',   label: 'Historial de Reportes',  icon: Clock },
        { id: 'calendario',  label: 'Calendario de Tareas',   icon: Calendar },
      ],
    },
  ];

  const toggleSection = (label) => {
    setOpenSections(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside className={`sidebar-admin ${collapsed ? 'sidebar-admin--collapsed' : ''}`}>

      {/* ── Encabezado institucional ── */}
      <div className="sidebar-admin__header">
        <UserBrand collapsed={collapsed} />
        <button className="sidebar-admin__toggle" onClick={onToggle} title={collapsed ? 'Expandir' : 'Colapsar'}>
          <ChevronLeft
            size={18}
            strokeWidth={2.5}
            style={{
              transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
          />
        </button>
      </div>

      {/* ── Rol del usuario ── */}
      {!collapsed && (
        <div className="sidebar-admin__role">
          <span className="sidebar-admin__role-dot" />
          <span className="sidebar-admin__role-label">Institución</span>
        </div>
      )}

      {/* ── Navegación ── */}
      <nav className="sidebar-admin__nav">
        {navSections.map(section => (
          <div key={section.label} className="sidebar-admin__section">

            {!collapsed && (
              <button
                className="sidebar-admin__section-title"
                onClick={() => toggleSection(section.label)}
              >
                <span>{section.label}</span>
                <span className="sidebar-admin__section-chevron">
                  <ChevronDown size={14} style={{ transform: openSections[section.label] ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.25s ease' }} />
                </span>
              </button>
            )}

            <ul className={`sidebar-admin__list ${!collapsed && !openSections[section.label] ? 'sidebar-admin__list--hidden' : ''}`}>
              {section.items.map(item => {
                const IconComp = item.icon;
                const isActive = activeView === item.id;
                return (
                  <li key={item.id}>
                    <button
                      id={`nav-institucion-${item.id}`}
                      className={`sidebar-admin__item ${isActive ? 'sidebar-admin__item--active' : ''}`}
                      onClick={() => onViewChange(item.id)}
                      title={collapsed ? item.label : undefined}
                    >
                      <span className="sidebar-admin__item-icon">
                        <IconComp />
                      </span>
                      {!collapsed && (
                        <span className="sidebar-admin__item-label">{item.label}</span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* ── Footer: cerrar sesión ── */}
      <div className="sidebar-admin__footer">
        <button className="sidebar-admin__logout" onClick={logout} title="Cerrar sesión" id="btn-logout-institucion">
          <LogOut size={18} />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
};

export default SidebarInstitucion;
