import React from 'react';
import LayoutDashboard from '../components/Shared/Navegacion/LayoutDashboard';
import SidebarInstitucion from '../components/DashboardInstitucion/Navegacion/SidebarInstitucion';
import SeccionPrincipal from '../components/Dashboard/SeccionPrincipal/SeccionPrincipal';

const DashboardInstitucion = () => (
  <LayoutDashboard sidebar={<SidebarInstitucion />}>
    <SeccionPrincipal />
  </LayoutDashboard>
);

export default DashboardInstitucion;
