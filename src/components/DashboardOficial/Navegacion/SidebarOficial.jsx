import React from 'react';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, LayoutGrid, Activity, Clock, LogOut, ChevronDown, User, MapPin } from 'lucide-react';
import UserBrand from "./UserBrand";
import MenuLinkItem from "./MenuLinkItem";

const SidebarOficial = ({ collapsed = false, onToggle, activeView, onViewChange }) => {
  const [operativoExpanded, setOperativoExpanded] = useState(true);
  const [gestionExpanded, setGestionExpanded] = useState(true);

  return (
    <aside className={`SidebarOficial ${collapsed ? 'SidebarOficial--collapsed' : ''}`}>
      <div className="SidebarMainContent">
        <div className="SidebarHeader">
           <UserBrand collapsed={collapsed} />
           <button className="SidebarTopToggleBtn" onClick={onToggle}>
             {collapsed ? <ChevronRight size={16} strokeWidth={2.5} /> : <ChevronLeft size={16} strokeWidth={2.5} />}
           </button>
        </div>
        
        {!collapsed && (
          <div className="RolePill">
            <span className="RolePillDot" />
            <span className="RolePillLabel">OFICIAL</span>
          </div>
        )}

        <nav className="SidebarNav">
          <div className="SidebarSection">
            {!collapsed && (
              <div className="SidebarSectionHeader" onClick={() => setOperativoExpanded(!operativoExpanded)}>
                <span>OPERATIVO</span>
                <ChevronDown size={14} className={`SectionChevron ${!operativoExpanded ? 'SectionChevron--collapsed' : ''}`} />
              </div>
            )}
            {(collapsed || operativoExpanded) && (
              <ul className="NavMenuLista">
                <li>
                  <MenuLinkItem 
                    label="Dashboard" 
                    icon={<LayoutGrid size={20} />}
                    isActive={activeView === 'dashboard'} 
                    onClick={() => onViewChange('dashboard')}
                    collapsed={collapsed}
                  />
                </li>
                <li>
                  <MenuLinkItem 
                    label="Mis Líneas de Acción" 
                    icon={activeView === 'lineas' ? <MapPin size={20} /> : <Activity size={20} />}
                    isActive={activeView === 'lineas'}
                    onClick={() => onViewChange('lineas')}
                    badgeCount={0} 
                    collapsed={collapsed}
                  />
                </li>
              </ul>
            )}
          </div>

          <div className="SidebarSection">
            {!collapsed && (
              <div className="SidebarSectionHeader" onClick={() => setGestionExpanded(!gestionExpanded)}>
                <span>GESTIÓN</span>
                <ChevronDown size={14} className={`SectionChevron ${!gestionExpanded ? 'SectionChevron--collapsed' : ''}`} />
              </div>
            )}
            {(collapsed || gestionExpanded) && (
              <ul className="NavMenuLista">
                <li>
                  <MenuLinkItem 
                    label="Historial de Reportes" 
                    icon={<Clock size={20} />}
                    isActive={activeView === 'historial'}
                    onClick={() => onViewChange('historial')}
                    badgeCount={0}
                    collapsed={collapsed}
                  />
                </li>
              </ul>
            )}
          </div>
        </nav>
      </div>

      <footer className="SidebarOficialFooter">
        <div className="ProfileCard">
          <div className="ProfileAvatar"><User size={20} color="#0f172a" strokeWidth={2.5} /></div>
          {!collapsed && (
            <div className="ProfileInfo">
              <span className="ProfileName">C. Araya</span>
              <span className="ProfileRole">Administrador</span>
            </div>
          )}
        </div>

        <button className="BtnLogoutLink" onClick={() => console.log('Logout')}>
          <div className="LogoutIconWrapper">
             <LogOut size={18} />
          </div>
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </footer>
    </aside>
  );
};

export default SidebarOficial;
