import React from 'react';

<<<<<<< HEAD:src/components/DashboardOficial/Navegacion/TopbarOficial.jsx
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
=======
const TopbarInstitucion = ({ usuario, seccion, subtitulo, rol }) => {
  return (
    <header className="TopbarInstitucion">
      <div className="TopbarIzquierda">
        <div className="TopbarLogosInstitucionales">
          <img src={logoMsp} alt="MSP" className="TopbarLogo" />
          <img src={logoInl} alt="INL" className="TopbarLogo" />
          <img src={logoSembremos} alt="Sembremos" className="TopbarLogo" />
        </div>
        <div className="TopbarSeccionInfo">
          <h2 className="TopbarBrandingTitulo">Sembremos Seguridad</h2>
          <p className="TopbarBrandingSubtitulo">Gobierno de la República de Costa Rica</p>
          <div className="TopbarSeccionContexto">
             <span className="SeccionBadge">{seccion || 'Dashboard'}</span>
             <span className="SeparadorDot"></span>
             <span className="ContextoSubtitulo">{subtitulo || 'Portal Institucional de Gestión'}</span>
          </div>
        </div>
      </div>
      
      <div className="TopbarDerecha">
        <div className="TopbarAcciones">
          <div className="StatusPill">
            <span className="StatusDot" />
            <span className="StatusLabel">{rol || 'INSTITUCIÓN'}</span>
          </div>
          <div className="UsuarioInfoMini">
            <span className="UsuarioNombre">{usuario?.nombre}</span>
            <span className="UsuarioZona">{usuario?.zona}</span>
          </div>
        </div>
>>>>>>> 9eef092f52afe0a93f7ac738b33a0de493f0cd1f:src/components/DashboardInstitucion/Navegacion/TopbarInstitucion.jsx
      </div>
    </div>
  );
};

export default TopbarInstitucion;
