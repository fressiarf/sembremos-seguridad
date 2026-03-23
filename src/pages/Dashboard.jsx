import React from 'react';
import LayoutDashboard from '../components/Shared/Navegacion/LayoutDashboard';
import SidebarAdmin from '../components/Dashboard/SidebarAdmin/SidebarAdmin';
import SeccionPrincipal from '../components/Dashboard/SeccionPrincipal/SeccionPrincipal';

const Dashboard = () => (
  <LayoutDashboard sidebar={<SidebarAdmin />}>
    <SeccionPrincipal />
  </LayoutDashboard>
);

export default Dashboard;

