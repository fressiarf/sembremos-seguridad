import React from 'react';
import ContenedorDashboard from '../components/Dashboard/ContenedorDashboard/ContenedorDashboard';
import SidebarAdmin from '../components/Dashboard/SidebarAdmin/SidebarAdmin';
import SeccionPrincipal from '../components/Dashboard/SeccionPrincipal/SeccionPrincipal';

const Dashboard = () => (
  <ContenedorDashboard>
    <SidebarAdmin />
    <SeccionPrincipal />
  </ContenedorDashboard>
);

export default Dashboard;

