import React from 'react';

const UserBrand = ({ collapsed }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: collapsed ? 0 : '10px',
      justifyContent: collapsed ? 'center' : 'flex-start',
    }}>
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '10px',
        background: 'linear-gradient(135deg, #c62828, #e53935)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 800,
        fontSize: '0.75rem',
        flexShrink: 0,
      }}>
        SS
      </div>
      {!collapsed && (
        <div>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.85rem', lineHeight: 1.2 }}>
            Sembremos
          </div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', fontWeight: 500 }}>
            Seguridad
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBrand;
