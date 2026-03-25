import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/login';
import DashboardEditores from '../pages/DashboardEditores';
import Dashboard from '../pages/Dashboard';
import DashboardAdminInstitucion from '../pages/DashboardAdminInstitucion';
import PrivateRoutes from './PrivateRoutes';
import SoporteAcceso from '../components/Login/SoporteContra/SoporteAcceso';


const Routing = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/soporte-acceso" element={<SoporteAcceso />} />
                {/*  Rutas Privadas */}

                <Route path="/dashboard" element={<PrivateRoutes><Dashboard /></PrivateRoutes>} />
                <Route path="/dashboardEditores" element={<PrivateRoutes><DashboardEditores /></PrivateRoutes>} />
                <Route path="/dashboardAdminInstitucion" element={<PrivateRoutes><DashboardAdminInstitucion /></PrivateRoutes>} />
            </Routes>
        </Router>
    );
};

export default Routing;