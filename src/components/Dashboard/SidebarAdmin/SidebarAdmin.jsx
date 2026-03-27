import React, { useState, useEffect } from 'react';
import '../../Dashboard/SidebarAdmin/SidebarAdmin.css';
import { dashboardService } from '../../../services/dashboardService';
import { useLogin } from "../../../context/LoginContext";
import UserBrand from "../../Shared/Navegacion/UserBrand";
import { ChevronLeft, ChevronDown, LayoutGrid, Activity, Clock, LogOut, User, MapPin, Shield, Bell, BellRing, TriangleAlert, FileText, Settings, Calendar, LayoutDashboard, MessageCircle } from "lucide-react";


// Navigation link items should be consistent, but for now we'll keep the admin structure
// and just update the visuals.

// ──────────────────────────────────────────────
//  Estructura de navegación
// ──────────────────────────────────────────────


// ──────────────────────────────────────────────
//  Componente principal
// ──────────────────────────────────────────────
const SidebarAdmin = ({ collapsed = false, onToggle, activeView, onViewChange }) => {
  const { user, logout } = useLogin();
  const [openSections, setOpenSections] = useState({
    PRINCIPAL: true, GESTIÓN: true, ANÁLISIS: true, ADMINISTRACIÓN: true,
  });

  const [stats, setStats] = useState({
    activitiesCount: 0,
    zonesCount: 0,
    alertsCount: 0,
    solicitudesCount: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      const data = await dashboardService.getStats();
      const solicitudes = JSON.parse(localStorage.getItem('solicitudes_acceso') || '[]');
      setStats({
        ...data,
        solicitudesCount: solicitudes.length
      });
    };
    fetchStats();
    
    // Opcional: Polling cada 30 segundos si se desea tiempo real
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // ── Secciones de navegación dinámicas ──
  const navSections = [
    {
      label: 'PRINCIPAL',
      items: [
        { id: 'dashboard',   label: 'Dashboard global',      icon: LayoutDashboard, path: '/dashboard' },
        { id: 'actividades', label: 'Actividad oficiales',   icon: Activity,  path: '/actividades', badge: stats.activitiesCount },
      ],
    },
    {
      label: 'GESTIÓN',
      items: [
        { id: 'matrices',    label: 'Todas las matrices',    icon: FileText,    path: '/matrices' },
        { id: 'zonas',       label: 'Zonas críticas',        icon: MapPin,      path: '/zonas',    badge: stats.zonesCount },
        { id: 'alertas',     label: 'Soporte y Comentarios',  icon: MessageCircle, path: '/alertas',  badge: stats.alertsCount },
      ],
    },
    {
      label: 'ANÁLISIS',
      items: [
        { id: 'mapa',        label: 'Distribución policial', icon: MapPin,       path: '/mapa' },
        { id: 'historial',   label: 'Historial',             icon: Clock,     path: '/historial' },
        { id: 'estadisticas',label: 'Estadísticas',          icon: Activity,     path: '/estadisticas' },
        { id: 'calendario',  label: 'Calendario',            icon: Calendar,  path: '/calendario' },
      ],
    },
    {
      label: 'ADMINISTRACIÓN',
      items: [
        { id: 'usuarios',    label: 'Gestión de usuarios',   icon: User,     path: '/usuarios', badge: stats.solicitudesCount },
        { id: 'reportes',    label: 'Reportes INL/MSP',      icon: FileText,    path: '/reportes' },
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
          <span className="sidebar-admin__role-label">
            {user?.rol === 'admin' ? 'Administrador' : 'Oficial'}
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
              <span className="sidebar-admin__profile-name">{user?.nombre || "C. Araya"}</span>
              <span className="sidebar-admin__profile-role">
                {user?.rol === 'admin' ? 'Administrador' : 'Oficial'}
              </span>
            </div>
          )}
        </div>


        <button className="sidebar-admin__logout" onClick={logout} title="Cerrar sesión" id="btn-logout">
          <LogOut size={18} />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
};

export default SidebarAdmin;
