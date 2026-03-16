import React from 'react';
import './SeccionPrincipal.css';

const SeccionPrincipal = ({ children, collapsed }) => {
  return (
    <main className={`main-content ${collapsed ? 'main-content--collapsed' : ''}`}>
      {children}
    </main>
  );
};

export default SeccionPrincipal;
