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
      right: 0,
      height: '6px',
      zIndex: 10000,
      pointerEvents: 'none',
      background: 'linear-gradient(to right, #002f6c 0% 17%, #ffffff 17% 33%, #ce1126 33% 67%, #ffffff 67% 83%, #002f6c 83% 100%)'
    }} />
  );
};

export default TricolorBar;
