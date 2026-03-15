import React from 'react';

const BtnAcceso = () => {
  return (
    <div className="ContenedorBotonAcceso">
      
      <button type="submit" className="BotonPrincipalAcceso">
        
        {/* Texto del botón */}
        <span className="TextoBotonAcceso">Ingresar al Sistema</span>

        {/* Espacio para un pequeño icono de flecha o candado */}
        <span className="IconoBotonAcceso">➡️</span>

        {/* Este elemento servirá para mostrar un Spinner de carga en el futuro */}
        <div className="IndicadorCargando"></div>

      </button>

      <p className="AvisoLegalAcceso">
        Uso exclusivo para personal del MSP / INL
      </p>

    </div>
  );
};

export default BtnAcceso;
