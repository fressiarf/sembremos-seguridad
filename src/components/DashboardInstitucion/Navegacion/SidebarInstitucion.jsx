import React, { useState } from 'react';
import '../../Dashboard/SidebarAdmin/SidebarAdmin.css';
import { useLogin } from "../../../context/LoginContext";
import UserBrand from "../../Shared/Navegacion/UserBrand";
import { ChevronLeft, ChevronDown, LayoutDashboard, Activity, Clock, LogOut, User, MapPin, Calendar, AlertCircle, MessageCircle, FileBarChart } from "lucide-react";
import Swal from 'sweetalert2';

const SidebarInstitucion = ({ collapsed = false, onToggle, activeView, onViewChange }) => {
  const { user, logout } = useLogin();
  const [openSections, setOpenSections] = useState({
    OPERATIVO: true, GESTIÓN: true,
  });

  // ── Secciones de navegación para el Oficial ──
  const navSections = [
    {
      label: 'OPERATIVO',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'lineas', label: 'Mis Tareas', icon: Activity },
      ],
    },
    {
      label: 'GESTIÓN',
      items: [
        { id: 'rechazados', label: 'Devoluciones', icon: AlertCircle },
        { id: 'historial', label: 'Historial de Reportes', icon: Clock },
        { id: 'calendario', label: 'Calendario de Tareas', icon: Calendar },
        { id: 'alertas', label: 'Soporte y Comentarios', icon: MessageCircle },
      ],
    },
  ];

  const toggleSection = (label) => {
    setOpenSections(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const handleLogout = () => {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Seguro que desea salir de su cuenta?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
      }
    });
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
          <span className="sidebar-admin__role-label">
            {user?.rol === 'admin' ? 'Fuerza Pública' : (user?.rol === 'adminInstitucion' ? 'Coordinador Institucional' : 'Editor')}
          </span>
        </div>
      )}

      {/* ── Navegación ── */}
      <nav className="sidebar-admin__nav">
        {navSections.map(section => (
          <div key={section.label} className="sidebar-admin__section">

            {/* Título de sección */}
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
                      <span className="sidebar-admin__item-icon">
                        <IconComp />
                      </span>

                      {!collapsed && (
                        <span className="sidebar-admin__item-label">{item.label}</span>
                      )}

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
        <div
          className={`sidebar-admin__profile ${activeView === 'perfil' ? 'sidebar-admin__profile--active' : ''}`}
          onClick={() => onViewChange('perfil')}
          title="Ver mi perfil"
        >
          <div className="sidebar-admin__avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
          </div>

          {!collapsed && (
            <div className="sidebar-admin__profile-info">
              <span className="sidebar-admin__profile-name">{user?.nombre || "Juan Vargas"}</span>
              <span className="sidebar-admin__profile-role">
                {user?.rol === 'editor' ? 'Editor' : (user?.rol === 'adminInstitucion' ? 'Coordinador Institucional' : 'Fuerza Pública')}
              </span>
            </div>
          )}
        </div>

        <button className="sidebar-admin__logout" onClick={handleLogout} title="Cerrar sesión" id="btn-logout">
          <LogOut size={18} />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
};

export default SidebarInstitucion;
