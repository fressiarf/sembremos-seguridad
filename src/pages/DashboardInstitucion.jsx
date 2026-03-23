import React from 'react';
import LayoutDashboard from '../components/Shared/Navegacion/LayoutDashboard';
import SidebarInstitucion from '../components/DashboardInstitucion/SidebarInstitucion';
import DashboardInstitucionContent from '../components/DashboardInstitucion/DashboardInstitucion';

const DashboardInstitucion = () => (
  <LayoutDashboard sidebar={<SidebarInstitucion />}>
    <DashboardInstitucionContent />
  </LayoutDashboard>
);

export default DashboardInstitucion;
