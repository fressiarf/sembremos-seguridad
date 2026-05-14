import React from 'react';
import LayoutDashboard from '../components/Shared/Navegacion/LayoutDashboard';
import SidebarMuni from '../components/DasboardMuni/SidebarMuni/SidebarMuni';
import SeccionPrincipalMuni from '../components/DasboardMuni/SeccionPrincipalMuni/SeccionPrincipalMuni';

const DasboardMuni = () => (
  <LayoutDashboard sidebar={<SidebarMuni />}>
    <SeccionPrincipalMuni />
  </LayoutDashboard>
);

export default DasboardMuni;