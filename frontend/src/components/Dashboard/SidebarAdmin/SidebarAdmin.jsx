import React, { useState, useEffect } from 'react';
import '../../Dashboard/SidebarAdmin/SidebarAdmin.css';
import { dashboardService } from '../../../services/dashboardService';
import { useLogin } from "../../../context/LoginContext";
import UserBrand from "../../Shared/Navegacion/UserBrand";
import { ChevronLeft, ChevronDown, LayoutGrid, Activity, Clock, LogOut, User, MapPin, Shield, Bell, BellRing, TriangleAlert, FileText, Settings, Calendar, LayoutDashboard, MessageCircle, FileBarChart, TrendingUp, PieChart, FileSearch, BarChart3 } from "lucide-react";
import Swal from 'sweetalert2';


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
    'DIRECCIÓN ESTRATÉGICA': true,
    'LÍNEAS DE ACCIÓN': true,
    'INTELIGENCIA TERRITORIAL': true,
    'GESTIÓN OPERATIVA': true,
    'MONITOREO Y EVALUACIÓN': true,
    'ADMINISTRACIÓN': true
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

  // ── Secciones de navegación dinámicas con SCopes ──
  const navSections = [
    {
      label: 'DIRECCIÓN ESTRATÉGICA',
      items: [
        { id: 'estadisticas', label: 'Centro de Análisis', icon: LayoutDashboard, scope: 'GLOBAL' },
        { id: 'mesa-cir', label: 'Mesa CIR Social', icon: Activity, scope: 'GLOBAL' },
      ],
    },
    {
      label: 'LÍNEAS DE ACCIÓN',
      items: [
        { id: 'lineas-accion', label: 'Líneas de Acción', icon: LayoutGrid, scope: 'GLOBAL' },
        { id: 'matriz-seguimiento', label: 'Matriz de Seguimiento', icon: FileText, scope: 'GLOBAL' },
      ],
    },
    {
      label: 'INTELIGENCIA TERRITORIAL',
      scope: 'MSP',
      items: [
        { id: 'zonas', label: 'Zonas Críticas y Riesgo', icon: MapPin, scope: 'MSP' },
        { id: 'mapa', label: 'Despliegue Policial', icon: MapPin, scope: 'MSP' },
      ],
    },
    {
      label: 'GESTIÓN OPERATIVA',
      items: [
        { id: 'actividades', label: 'Gestión de Tareas', icon: LayoutGrid, scope: 'GLOBAL' },
        { id: 'consolidado', label: 'Consolidado Trimestral', icon: FileBarChart, scope: 'MUNI' },
        { id: 'calendario',  label: 'Calendario Institucional', icon: Calendar, scope: 'GLOBAL' },
      ],
    },
    {
      label: 'MONITOREO Y EVALUACIÓN',
      items: [
        { id: 'reportes-resultados', label: 'Revisión de Reportes', icon: FileSearch, scope: 'GLOBAL' },
        { id: 'historial', label: 'Historial de Reportes', icon: Clock, scope: 'GLOBAL' },
      ],
    },
    {
      label: 'ADMINISTRACIÓN',
      items: [
        { id: 'usuarios', label: 'Gestión de Funcionarios', icon: User, badge: stats.solicitudesCount, scope: 'GLOBAL' },
        { id: 'alertas', label: 'Soporte y Comentarios',  icon: MessageCircle, badge: stats.alertsCount, scope: 'GLOBAL' },
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
            {user?.nivel === 'MSP' ? 'Fuerza Pública' : 'Municipalidad'}
          </span>
        </div>
      )}

      {/* ── Navegación ── */}
      <nav className="sidebar-admin__nav">
        {navSections
          .filter(section => !section.scope || section.scope === 'GLOBAL' || section.scope === user?.nivel)
          .map(section => {
            // Filtrar items dentro de la sección
            const visibleItems = section.items.filter(item => 
              !item.scope || item.scope === 'GLOBAL' || item.scope === user?.nivel
            );

            if (visibleItems.length === 0) return null;

            return (
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
                  {visibleItems.map(item => {
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
            );
          })}
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
              <span className="sidebar-admin__profile-name">
                {user?.rol === 'admin' ? 'Administrador global' : (user?.nombre || "C. Araya")}
              </span>
              <span className="sidebar-admin__profile-role">
                {user?.rol === 'admin' ? 'Administrador' : 'Oficial'}
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

export default SidebarAdmin;
