import React, { useState } from 'react';
import ContenedorDashboard from '../components/Dashboard/ContenedorDashboard/ContenedorDashboard';
import SidebarAdmin from '../components/Dashboard/SidebarAdmin/SidebarAdmin';
import SeccionPrincipal from '../components/Dashboard/SeccionPrincipal/SeccionPrincipal';
import DashboardGlobal from '../components/Dashboard/DashboardGlobal/DashboardGlobal';
import ActividadOficiales from '../components/Dashboard/ActividadOficiales/ActividadOficiales';

const Dashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleViewChange = (viewId) => {
    setActiveView(viewId);
  };

  return (
    <ContenedorDashboard collapsed={isSidebarCollapsed}>
      <SidebarAdmin 
        collapsed={isSidebarCollapsed} 
        onToggle={toggleSidebar} 
        activeView={activeView}
        onViewChange={handleViewChange}
      />
      <SeccionPrincipal collapsed={isSidebarCollapsed}>
        {activeView === 'dashboard' && <DashboardGlobal />}
        {activeView === 'actividades' && <ActividadOficiales />}
        {/* Placeholder para otras vistas */}
        {activeView !== 'dashboard' && activeView !== 'actividades' && (
          <div style={{ padding: '2rem', color: '#7a9cc4' }}>
            <h2>Vista en desarrollo: {activeView}</h2>
            <p>Esta sección se implementará próximamente.</p>
          </div>
        )}
      </SeccionPrincipal>
    </ContenedorDashboard>
  );
};

export default Dashboard;
