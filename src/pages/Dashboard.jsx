import React, { useState } from 'react';
import ContenedorDashboard from '../components/Dashboard/ContenedorDashboard/ContenedorDashboard';
import SidebarAdmin from '../components/Dashboard/SidebarAdmin/SidebarAdmin';
import SeccionPrincipal from '../components/Dashboard/SeccionPrincipal/SeccionPrincipal';

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
      <SeccionPrincipal 
        collapsed={isSidebarCollapsed} 
        activeView={activeView} 
      />
    </ContenedorDashboard>
  );
};

export default Dashboard;

