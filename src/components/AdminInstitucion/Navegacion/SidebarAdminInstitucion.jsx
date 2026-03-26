import React, { useState } from 'react';
import '../../Dashboard/SidebarAdmin/SidebarAdmin.css';
import { useLogin } from "../../../context/LoginContext";
import UserBrand from "../../Shared/Navegacion/UserBrand";
import {
  ChevronLeft, ChevronDown, LayoutDashboard, ClipboardList,
  FileSearch, Clock, Calendar, LogOut, Users, BarChart3
} from "lucide-react";

const SidebarAdminInstitucion = ({ collapsed = false, onToggle, activeView, onViewChange }) => {
  const { user, logout } = useLogin();
  const [openSections, setOpenSections] = useState({
    OPERATIVO: true,
    SUPERVISIÓN: true,
    ANÁLISIS: true,
    PLANIFICACIÓN: true,
  });

  const navSections = [
    {
      label: 'OPERATIVO',
      items: [
        { id: 'dashboard',  label: 'Dashboard',            icon: LayoutDashboard },
        { id: 'tareas',     label: 'Gestión de Tareas',    icon: ClipboardList },
        { id: 'usuarios',   label: 'Gestión de Funcionarios', icon: Users },
      ],
    },
    {
      label: 'SUPERVISIÓN',
      items: [
        { id: 'reportes',   label: 'Revisión de Reportes', icon: FileSearch },
        { id: 'historial',  label: 'Historial de Reportes', icon: Clock },
      ],
    },
    {
      label: 'ANÁLISIS',
      items: [
        { id: 'estadisticas', label: 'Estadísticas', icon: BarChart3 },
      ],
    },
    {
      label: 'PLANIFICACIÓN',
      items: [
        { id: 'calendario', label: 'Calendario',           icon: Calendar },
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
        <button type="button" className="sidebar-admin__toggle" onClick={onToggle} title={collapsed ? 'Expandir' : 'Colapsar'}>
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
          <span className="sidebar-admin__role-label">Admin Institución</span>
        </div>
      )}

      {/* ── Navegación ── */}
      <nav className="sidebar-admin__nav">
        {navSections.map(section => (
          <div key={section.label} className="sidebar-admin__section">

            {!collapsed && (
              <button
                type="button"
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
                      type="button"
                      id={`nav-${item.id}`}
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

      {/* ── Footer: perfil + cerrar sesión ── */}
      <div className="sidebar-admin__footer">
        <div
          className={`sidebar-admin__profile ${activeView === 'perfil' ? 'sidebar-admin__profile--active' : ''}`}
          onClick={() => onViewChange('perfil')}
          title="Ver mi perfil"
        >
          <div className="sidebar-admin__avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          {!collapsed && (
            <div className="sidebar-admin__profile-info">
              <span className="sidebar-admin__profile-name">{user?.nombre || "Admin"}</span>
              <span className="sidebar-admin__profile-role">
                {user?.institucion || 'Admin Institución'}
              </span>
            </div>
          )}
        </div>
        <button type="button" className="sidebar-admin__logout" onClick={logout} title="Cerrar sesión" id="btn-logout">
          <LogOut size={18} />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
};

export default SidebarAdminInstitucion;
