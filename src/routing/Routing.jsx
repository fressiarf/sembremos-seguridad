import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/login';
import DashboardOficial from '../pages/DashboardOficial';
import Dashboard from '../pages/Dashboard';
import DashboardInstitucion from '../pages/DashboardInstitucion';

const Routing = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboardOficial" element={<DashboardOficial />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboardInstitucion" element={<DashboardInstitucion />} />
            </Routes>
        </Router>
    );
};

export default Routing;