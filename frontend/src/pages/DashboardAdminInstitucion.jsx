import React from 'react';
import LayoutDashboard from '../components/Shared/Navegacion/LayoutDashboard';
import SidebarAdminInstitucion from '../components/AdminInstitucion/Navegacion/SidebarAdminInstitucion';
import SeccionPrincipalAdminInstitucion from '../components/AdminInstitucion/SeccionPrincipalAdminInstitucion';

const DashboardAdminInstitucion = () => (
  <LayoutDashboard sidebar={<SidebarAdminInstitucion />}>
    <SeccionPrincipalAdminInstitucion />
  </LayoutDashboard>
);

export default DashboardAdminInstitucion;
