import React from 'react';
import './BtnAcceso.css';

import { LogIn } from 'lucide-react';

const BtnAcceso = () => {
  return (
    <div className="ContenedorBotonAcceso">
      
      <button type="submit" className="BotonPrincipalAcceso">
        
        <span className="TextoBotonAcceso">Ingresar al Sistema</span>

        <span className="IconoBotonAcceso">
          <LogIn size={18} />
        </span>

        <div className="IndicadorCargando"></div>

      </button>

      <p className="AvisoLegalAcceso">
        Uso exclusivo para personal del MSP / INL
      </p>

    </div>
  );
};

export default BtnAcceso;
