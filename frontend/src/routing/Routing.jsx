import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/login';
import DashboardEditores from '../pages/DashboardEditores';
import Dashboard from '../pages/Dashboard';
import DashboardAdminInstitucion from '../pages/DashboardAdminInstitucion';
import DasboardMuni from '../pages/DasboardMuni';
import PrivateRoutes from './PrivateRoutes';
import SoporteAcceso from '../components/Login/SoporteContra/SoporteAcceso';
import { ROLES } from '../constants/roles';

const Routing = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/soporte-acceso" element={<SoporteAcceso />} />
                {/*  Rutas Privadas */}
                <Route path="/dashboard" element={<PrivateRoutes allowedRoles={[ROLES.SUPER_ADMIN]}><Dashboard /></PrivateRoutes>} />
                <Route path="/dasboardMuni" element={<PrivateRoutes allowedRoles={[ROLES.SUB_ADMIN]}><DasboardMuni /></PrivateRoutes>} />
                <Route path="/dashboardEditores" element={<PrivateRoutes allowedRoles={[ROLES.EDITOR]}><DashboardEditores /></PrivateRoutes>} />
                <Route path="/dashboardAdminInstitucion" element={<PrivateRoutes allowedRoles={[ROLES.ADMIN_INSTITUCION]}><DashboardAdminInstitucion /></PrivateRoutes>} />
            </Routes>
        </Router>
    );
};

export default Routing;