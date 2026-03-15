import React from 'react';

const HeaderInstitucional = () => {
  return (
    <header className="HeaderContenedor">
      
      {/* Sección Izquierda: Logos de la Tríada */}
      <div className="SeccionLogosInstitucionales">
        
        <div className="ContenedorLogoItem">
          <img src="/logo-msp.png" alt="Logo MSP" className="ImagenLogoMsp" />
        </div>

        <div className="ContenedorLogoItem">
          <img src="/logo-inl.png" alt="Logo INL" className="ImagenLogoInl" />
        </div>

        <div className="ContenedorLogoItem">
          <img src="/logo-sembremos.png" alt="Logo Sembremos Seguridad" className="ImagenLogoSembremos" />
        </div>

      </div>

      {/* Sección Central/Derecha: Título del Proyecto */}
      <div className="SeccionBranding">
        <h1 className="TituloProyecto">Sembremos Seguridad</h1>
        <span className="SeparadorVertical"></span>
        <p className="SubtituloGobierno">Gobierno de la República de Costa Rica</p>
      </div>

      {/* Sección de Apoyo (Opcional para el Martes) */}
      <div className="SeccionAccesoStatus">
        <span className="EtiquetaAcceso">Portal Oficial de Gestión</span>
      </div>

    </header>
  );
};

export default HeaderInstitucional;
