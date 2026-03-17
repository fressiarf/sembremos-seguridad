import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/login';
import DashboardOficial from '../pages/DashboardOficial';
import Dashboard from '../pages/Dashboard';

const Routing = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboardOficial" element={<DashboardOficial />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </Router>
    );
};

export default Routing;