import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/login';
import DashboardEditores from '../pages/DashboardEditores';
import Dashboard from '../pages/Dashboard';
import DashboardAdminInstitucion from '../pages/DashboardAdminInstitucion';
import DasboardMuni from '../pages/DasboardMuni';
import PrivateRoutes from './PrivateRoutes';
import SoporteAcceso from '../components/Login/SoporteContra/SoporteAcceso';


const Routing = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/soporte-acceso" element={<SoporteAcceso />} />
                {/*  Rutas Privadas */}

                <Route path="/dashboard" element={<PrivateRoutes allowedRoles={['admin']}><Dashboard /></PrivateRoutes>} />
                <Route path="/dasboardMuni" element={<PrivateRoutes allowedRoles={['municipalidad']}><DasboardMuni /></PrivateRoutes>} />
                <Route path="/dashboardEditores" element={<PrivateRoutes allowedRoles={['institucion', 'oficial', 'editor']}><DashboardEditores /></PrivateRoutes>} />
                <Route path="/dashboardAdminInstitucion" element={<PrivateRoutes allowedRoles={['adminInstitucion']}><DashboardAdminInstitucion /></PrivateRoutes>} />
            </Routes>
        </Router>
    );
};

export default Routing;