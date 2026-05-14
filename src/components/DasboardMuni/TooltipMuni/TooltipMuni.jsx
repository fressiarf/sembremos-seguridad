import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';

/**
 * Tooltip contextual para el Dashboard Municipal.
 * Se muestra al hacer hover/click en el ícono de ayuda (?).
 * Props:
 *   - text: Texto del tooltip
 *   - icon: Ícono personalizado (opcional, default: HelpCircle)
 *   - maxWidth: Ancho máximo del tooltip (default: 320px)
 *   - position: 'top' | 'bottom' | 'left' | 'right' (default: 'bottom')
 */
const TooltipMuni = ({ text, icon: Icon = HelpCircle, maxWidth = 320, position = 'bottom' }) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setVisible(false);
      }
    };
    if (visible) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [visible]);

  const getPositionStyles = () => {
    const base = { position: 'absolute', zIndex: 9999 };
    switch (position) {
      case 'top': return { ...base, bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '8px' };
      case 'left': return { ...base, right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: '8px' };
      case 'right': return { ...base, left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: '8px' };
      default: return { ...base, top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '8px' };
    }
  };

  return (
    <span
      ref={ref}
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onClick={() => setVisible(v => !v)}
    >
      <Icon
        size={15}
        strokeWidth={2}
        style={{
          color: '#94a3b8',
          opacity: 0.8,
          transition: 'color 0.2s, opacity 0.2s',
          ...(visible ? { color: '#0d9488', opacity: 1 } : {}),
        }}
      />
      {visible && (
        <div style={{
          ...getPositionStyles(),
          width: 'max-content',
          maxWidth: `${maxWidth}px`,
          background: '#0f172a',
          color: '#f1f5f9',
          fontSize: '0.76rem',
          fontWeight: 500,
          lineHeight: 1.5,
          padding: '10px 14px',
          borderRadius: '10px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
          animation: 'tooltipFadeIn 0.15s ease-out',
          pointerEvents: 'none',
          fontFamily: 'Inter, sans-serif',
          letterSpacing: '0.01em',
        }}>
          {/* Flecha */}
          <div style={{
            position: 'absolute',
            width: '8px',
            height: '8px',
            background: '#0f172a',
            transform: 'rotate(45deg)',
            ...(position === 'bottom' ? { top: '-4px', left: '50%', marginLeft: '-4px' } :
              position === 'top' ? { bottom: '-4px', left: '50%', marginLeft: '-4px' } :
              position === 'right' ? { left: '-4px', top: '50%', marginTop: '-4px' } :
              { right: '-4px', top: '50%', marginTop: '-4px' }),
          }} />
          {text}
        </div>
      )}
    </span>
  );
};

export default TooltipMuni;
