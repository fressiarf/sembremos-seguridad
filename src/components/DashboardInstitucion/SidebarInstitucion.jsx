import React from 'react';
import '../Dashboard/SidebarAdmin/SidebarAdmin.css';
import { useLogin } from '../../context/LoginContext';
import UserBrand from '../DashboardOficial/Navegacion/UserBrand';
import { ChevronLeft, LayoutDashboard, FileText, Send, LogOut, Building2 } from 'lucide-react';

const SidebarInstitucion = ({ collapsed = false, onToggle, activeView, onViewChange }) => {
  const { logout, user } = useLogin();
  const institucion = user?.institucion || 'Institución';

  const navItems = [
    { id: 'dashboard', label: 'Panel Institucional', icon: LayoutDashboard },
    { id: 'lineas', label: 'Mis Líneas de Acción', icon: FileText },
    { id: 'reportes', label: 'Historial de Reportes', icon: Send },
  ];

  return (
    <aside className={`sidebar-admin ${collapsed ? 'sidebar-admin--collapsed' : ''}`}>
      <div className="sidebar-admin__header">
        <UserBrand collapsed={collapsed} />
        <button className="sidebar-admin__toggle" onClick={onToggle} title={collapsed ? 'Expandir' : 'Colapsar'}>
          <ChevronLeft 
            size={18} 
            strokeWidth={2.5}
            style={{ 
              transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)', 
              transition: 'transform 0.4s ease' 
            }}
          />
        </button>
      </div>

      {!collapsed && (
        <div className="sidebar-admin__role">
          <span className="sidebar-admin__role-dot" style={{ backgroundColor: '#3b82f6' }} />
          <span className="sidebar-admin__role-label">Enlace Institucional</span>
        </div>
      )}

      <nav className="sidebar-admin__nav">
        <div className="sidebar-admin__section">
          <ul className="sidebar-admin__list">
            {navItems.map(item => {
              const IconComp = item.icon;
              const isActive = activeView === item.id || (activeView === undefined && item.id === 'dashboard');
              
              return (
                <li key={item.id}>
                  <button
                    className={`sidebar-admin__item ${isActive ? 'sidebar-admin__item--active' : ''}`}
                    onClick={() => onViewChange?.(item.id)}
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
      </nav>

      <div className="sidebar-admin__footer">
        <div className="sidebar-admin__profile" title={`Perfil: ${institucion}`}>
          <div className="sidebar-admin__avatar">
            <Building2 size={16} />
          </div>
          {!collapsed && (
            <div className="sidebar-admin__profile-info">
              <span className="sidebar-admin__profile-name">{institucion}</span>
              <span className="sidebar-admin__profile-role">Institución</span>
            </div>
          )}
        </div>

        <button className="sidebar-admin__logout" onClick={logout} title="Cerrar sesión">
          <LogOut size={18} />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
};

export default SidebarInstitucion;
