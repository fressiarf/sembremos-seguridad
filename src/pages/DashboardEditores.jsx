import React from 'react';
import LayoutDashboard from '../components/Shared/Navegacion/LayoutDashboard';
import SidebarInstitucion from '../components/DashboardInstitucion/Navegacion/SidebarInstitucion';
import SeccionPrincipalInstitucion from '../components/DashboardInstitucion/SeccionPrincipalInstitucion';

const DashboardEditores = () => (
  <LayoutDashboard sidebar={<SidebarInstitucion />}>
    <SeccionPrincipalInstitucion />
  </LayoutDashboard>
);

export default DashboardEditores;
