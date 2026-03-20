import React from 'react';

const SidebarOficial = ({ collapsed, onToggle, activeView, onViewChange }) => {
  return (
    <aside style={{
      width: collapsed ? '70px' : '260px',
      background: '#0b2240',
      minHeight: '100vh',
      transition: 'width 0.3s ease',
      padding: '1rem 0',
    }}>
      <div style={{ color: '#fff', textAlign: 'center', padding: '1rem', fontSize: '0.8rem' }}>
        {!collapsed && 'Oficial'}
      </div>
    </aside>
  );
};

export default SidebarOficial;
