import React from 'react';
import './HeaderInstitucional.css';
import logoMsp from '../../../assets/Msp_logo-removebg-preview.png';
import logoInl from '../../../assets/inl-logo-acronym-vertical-navy-removebg-preview.png';
import logoSembremos from '../../../assets/Captura_de_pantalla_2026-03-15_191337-removebg-preview.png';

const HeaderInstitucional = () => {
  return (
    <header className="HeaderContenedor">
      
      <div className="SeccionLogosInstitucionales">
        
        <div className="ContenedorLogoItem">
          <img src={logoMsp} alt="Logo MSP" className="ImagenLogoMsp" />
        </div>

        <div className="ContenedorLogoItem">
          <img src={logoInl} alt="Logo INL" className="ImagenLogoInl" />
        </div>

        <div className="ContenedorLogoItem">
          <img src={logoSembremos} alt="Logo Sembremos Seguridad" className="ImagenLogoSembremos" />
        </div>

      </div>

      <div className="SeccionBranding">
        <h1 className="TituloProyecto">Sembremos Seguridad</h1>
        <span className="SeparadorVertical"></span>
        <p className="SubtituloGobierno">Gobierno de la República de Costa Rica</p>
      </div>

      <div className="SeccionAccesoStatus">
        <span className="EtiquetaAcceso">Portal Oficial de Gestión</span>
      </div>

    </header>
  );
};

export default HeaderInstitucional;
