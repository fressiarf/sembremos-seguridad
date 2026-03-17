import React from 'react';
import LayoutDashboard from '../components/DashboardOficial/Navegacion/LayoutDashboard';
import SidebarOficial from '../components/DashboardOficial/Navegacion/SidebarOficial';
import SeccionPrincipalOficial from '../components/DashboardOficial/SeccionPrincipalOficial';

const DashboardOficial = () => {
  return (
    <LayoutDashboard sidebar={<SidebarOficial />}>
      <SeccionPrincipalOficial />
    </LayoutDashboard>
  );
};

export default DashboardOficial;
