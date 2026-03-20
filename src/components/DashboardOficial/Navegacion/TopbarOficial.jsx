import React from 'react';

const TopbarOficial = ({ seccion, subtitulo, usuario, rol, children }) => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #002f6c 0%, #004d99 50%, #0066cc 100%)',
      padding: '1.5rem 2.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <div>
        <h2 style={{ margin: 0, color: '#fff', fontSize: '1.25rem', fontWeight: 700 }}>
          {seccion || 'Dashboard'}
        </h2>
        {subtitulo && (
          <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
            {subtitulo}
          </p>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {children}
        {rol && (
          <span style={{
            background: 'rgba(255,255,255,0.15)',
            color: '#fff',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.05em',
          }}>
            {rol}
          </span>
        )}
        {usuario && (
          <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>
            {usuario.nombre}
          </span>
        )}
      </div>
    </div>
  );
};

export default TopbarOficial;
