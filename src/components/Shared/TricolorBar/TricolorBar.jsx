import React from 'react';

/**
 * TricolorBar Component
 * Represents the institutional flag band (Costa Rica colors).
 * Used at the top of headers or as a global window banner.
 */
const TricolorBar = ({ isFixed = false }) => {
  return (
    <div style={{
      position: isFixed ? 'fixed' : 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '6px',
      display: 'flex',
      zIndex: 10000,
      pointerEvents: 'none'
    }}>
      {/* Blue - White - Red - White - Blue (Flag proportions approx) */}
      <div style={{ flex: '1.5', backgroundColor: '#002f6c' }}></div>
      <div style={{ flex: '0.8', backgroundColor: '#ffffff' }}></div>
      <div style={{ flex: '3', backgroundColor: '#ce1126' }}></div>
      <div style={{ flex: '0.8', backgroundColor: '#ffffff' }}></div>
      <div style={{ flex: '1.5', backgroundColor: '#002f6c' }}></div>
    </div>
  );
};

export default TricolorBar;
