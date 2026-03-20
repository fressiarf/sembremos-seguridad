import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/login';
import DashboardInstitucion from '../pages/DashboardInstitucion';
import Dashboard from '../pages/Dashboard';
import DashboardInstitucion from '../pages/DashboardInstitucion';
import DashboardOficial from '../pages/DashboardOficial';
import PrivateRoutes from './PrivateRoutes';

const Routing = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                {/*  Rutas Privadas */}
                <Route path="/dashboardOficial" element={<PrivateRoutes><DashboardOficial /></PrivateRoutes>} />
                <Route path="/dashboard" element={<PrivateRoutes><Dashboard /></PrivateRoutes>} />
                <Route path="/dashboardInstitucion" element={<PrivateRoutes><DashboardInstitucion /></PrivateRoutes>} />
            </Routes>
        </Router>
    );
};

export default Routing;