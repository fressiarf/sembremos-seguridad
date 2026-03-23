import React from 'react';

import LayoutDashboard from '../components/DashboardInstitucion/Navegacion/LayoutDashboard';
import SidebarInstitucion from '../components/DashboardInstitucion/Navegacion/SidebarInstitucion';
import TopbarInstitucion from '../components/DashboardInstitucion/Navegacion/TopbarInstitucion';
import SeccionPrincipalInstitucion from '../components/DashboardInstitucion/SeccionPrincipalInstitucion';

const DashboardInstitucion = () => {
  return (
    <LayoutDashboard sidebar={<SidebarInstitucion />}>
      <TopbarInstitucion />
      <SeccionPrincipalInstitucion />
    </LayoutDashboard>
  );
};

export default DashboardInstitucion;
