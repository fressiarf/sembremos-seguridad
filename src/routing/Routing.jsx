import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/login';
import DashboardInstitucion from '../pages/DashboardInstitucion';
import Dashboard from '../pages/Dashboard';
import PrivateRoutes from './PrivateRoutes';

const Routing = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />

                {/*  Rutras Privadas */}
                <Route path="/dashboardInstitucion" element={<PrivateRoutes><DashboardInstitucion /></PrivateRoutes>} />
                <Route path="/dashboard" element={<PrivateRoutes><Dashboard /></PrivateRoutes>} />
            </Routes>
        </Router>
    );
};

export default Routing;