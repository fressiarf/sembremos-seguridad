import React from 'react';

const SeccionPrincipalOficial = ({ collapsed, activeView }) => {
  return (
    <main style={{ flex: 1, padding: '2rem', color: '#0b2240' }}>
      <p>Sección del oficial — vista: {activeView}</p>
    </main>
  );
};

export default SeccionPrincipalOficial;
