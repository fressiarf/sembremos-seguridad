import React, { useState } from 'react';
import './ContenedorDashboard.css';

const ContenedorDashboard = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');

  // Pasamos el estado de colapso y vista activa a los hijos de forma dinámica
  return (
    <div className="dashboard-wrapper">
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { 
            collapsed, 
            onToggle: () => setCollapsed(!collapsed),
            activeView,
            onViewChange: (viewId) => setActiveView(viewId)
          });
        }
        return child;
      })}
    </div>
  );
};

export default ContenedorDashboard;
