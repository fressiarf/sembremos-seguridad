import React, { useState } from 'react';
import '../DashboardInstitucion.css';

const LayoutDashboard = ({ sidebar, children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
      {sidebar && React.cloneElement(sidebar, {
        collapsed,
        onToggle: () => setCollapsed(!collapsed),
        activeView,
        onViewChange: setActiveView,
      })}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {React.Children.map(children, child =>
          child ? React.cloneElement(child, { collapsed, setCollapsed, activeView, setActiveView }) : null
        )}
      </div>
    </div>
  );
};

export default LayoutDashboard;
