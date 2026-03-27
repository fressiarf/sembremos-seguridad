import React from 'react';
import logoMsp from '../../../assets/Msp_logo-removebg-preview.png';
import logoInl from '../../../assets/inl-logo-acronym-vertical-navy-removebg-preview.png';
import logoSembremos from '../../../assets/Captura_de_pantalla_2026-03-15_191337-removebg-preview.png';

const TopbarInstitucion = ({ usuario, seccion, subtitulo, rol }) => {
  return (
    <header className="TopbarInstitucion" style={{ marginTop: '6px' }}>
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
        {children}
      </div>
    </header>
  );
};

export default TopbarInstitucion;
