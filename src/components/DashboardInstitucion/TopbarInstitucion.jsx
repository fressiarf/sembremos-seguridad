import React from 'react';
import mspLogo from '../../assets/Msp_logo-removebg-preview.png';
import inlLogo from '../../assets/inl-logo-acronym-vertical-navy-removebg-preview.png';
// Asumimos que esta captura es el logo de Sembremos Seguridad por el historial del proyecto
import sembremosLogo from '../../assets/Captura_de_pantalla_2026-03-15_191337-removebg-preview.png'; 

const TopbarInstitucion = ({ children, portalTitle = 'PORTAL INSTITUCIONAL DE GESTIÓN', badgeText = 'INSTITUCIÓN' }) => {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      position: 'relative',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Línea tricolor superior (Bandera Costa Rica simplificada) */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '6px',
        display: 'flex'
      }}>
        <div style={{ flex: 1, backgroundColor: '#002f6c' }}></div>
        <div style={{ flex: 1, backgroundColor: '#ce1126' }}></div>
        <div style={{ flex: 1, backgroundColor: '#002f6c' }}></div>
      </div>

      <div style={{
        padding: '1.5rem 2.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '6px' // Espacio para la bandera
      }}>
        {/* Lado izquierdo: Logos y Textos */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          
          {/* Bloque de Logos */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img src={mspLogo} alt="MSP" style={{ height: '45px', objectFit: 'contain' }} />
            <img src={inlLogo} alt="INL" style={{ height: '40px', objectFit: 'contain' }} />
            <img src={sembremosLogo} alt="Sembremos Seguridad" style={{ height: '45px', objectFit: 'contain' }} />
          </div>

          {/* Separador */}
          <div style={{ height: '50px', width: '1px', backgroundColor: '#e2e8f0' }}></div>

          {/* Bloque de Textos */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h1 style={{ 
              margin: '0', 
              color: '#002f6c', 
              fontSize: '1.2rem', 
              fontWeight: 800,
              letterSpacing: '0.05em'
            }}>
              SEMBREMOS SEGURIDAD
            </h1>
            <h2 style={{ 
              margin: '0.1rem 0 0.4rem 0', 
              color: '#334155', 
              fontSize: '0.75rem', 
              fontWeight: 600,
              letterSpacing: '0.02em'
            }}>
              GOBIERNO DE LA REPÚBLICA DE COSTA RICA
            </h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ 
                backgroundColor: '#dcfce7', 
                color: '#166534', 
                fontSize: '0.65rem', 
                fontWeight: 800, 
                padding: '2px 8px', 
                borderRadius: '4px',
                letterSpacing: '0.05em'
              }}>
                DASHBOARD
              </span>
              <span style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>•</span>
              <span style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' }}>
                {portalTitle}
              </span>
            </div>
          </div>
        </div>

        {/* Lado derecho: Indicador Institución y Children (P.ej botón PDF) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '9999px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}>
            <div style={{ 
              width: '8px', 
              height: '8px', 
              backgroundColor: '#16a34a', 
              borderRadius: '50%' 
            }}></div>
            <span style={{ 
              color: '#002f6c', 
              fontSize: '0.75rem', 
              fontWeight: 800,
              letterSpacing: '0.02em',
              textTransform: 'uppercase'
            }}>
              {badgeText}
            </span>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
};

export default TopbarInstitucion;
