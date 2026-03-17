import React, { useState } from 'react';
import './ContenedorDashboard.css';

const ContenedorDashboard = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  // Pasamos el estado a los hijos de forma dinámica
  return (
    <div className="dashboard-wrapper">
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { 
            collapsed, 
            onToggle: () => setCollapsed(!collapsed) 
          });
        }
        return child;
      })}
    </div>
  );
};

export default ContenedorDashboard;
