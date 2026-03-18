import React from 'react';
import LayoutDashboard from '../components/DashboardOficial/Navegacion/LayoutDashboard';
import SidebarOficial from '../components/DashboardOficial/Navegacion/SidebarOficial';
import TopbarOficial from '../components/DashboardOficial/Navegacion/TopbarOficial';
import SeccionPrincipalOficial from '../components/DashboardOficial/SeccionPrincipalOficial';

const DashboardOficial = () => {
  return (
    <LayoutDashboard sidebar={<SidebarOficial />}>
      <TopbarOficial />
      <SeccionPrincipalOficial />
    </LayoutDashboard>
  );
};

export default DashboardOficial;
