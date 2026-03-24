import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/login';
import DashboardInstitucion from '../pages/DashboardInstitucion';
import Dashboard from '../pages/Dashboard';
import DashboardAdminInstitucion from '../pages/DashboardAdminInstitucion';
import SoporteAcceso from '../pages/SoporteAcceso';
import PrivateRoutes from './PrivateRoutes';

const Routing = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                {/*  Rutas Privadas */}

                <Route path="/dashboard" element={<PrivateRoutes><Dashboard /></PrivateRoutes>} />
                <Route path="/dashboardInstitucion" element={<PrivateRoutes><DashboardInstitucion /></PrivateRoutes>} />
                <Route path="/dashboardAdminInstitucion" element={<PrivateRoutes><DashboardAdminInstitucion /></PrivateRoutes>} />
            </Routes>
        </Router>
    );
};

export default Routing;