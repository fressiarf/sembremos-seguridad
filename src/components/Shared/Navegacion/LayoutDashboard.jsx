import React, { useState } from 'react';
import './LayoutDashboard.css';

const LayoutDashboard = ({ sidebar, children }) => {
  const [activeView, setActiveView] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);

  const renderSidebar = () => {
    if (React.isValidElement(sidebar)) {
      return React.cloneElement(sidebar, { 
        activeView, 
        onViewChange: setActiveView,
        collapsed,
        onToggle: () => setCollapsed(!collapsed)
      });
    }
    return sidebar;
  };

  const renderContent = () => {
    return React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, { activeView, collapsed });
      }
      return child;
    });
  };

  return (
    <div className={`LayoutDashboard ${collapsed ? 'LayoutDashboard--collapsed' : ''}`}>
      {renderSidebar()}
      <div className="ContenedorPrincipalDashboard">
        {renderContent()}
      </div>
    </div>
  );
};

export default LayoutDashboard;
