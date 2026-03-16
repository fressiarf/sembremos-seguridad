import React from 'react';
import './SelectorModerno.css';
import { Mail, IdCard } from 'lucide-react';

const SelectorMetodoModerno = () => {
  return (
    <nav className="ContenedorSelectorModerno">
      
      {/* Opción para autenticación por Correo */}
      <div className="OpcionMetodoItem ItemActivo">
        <span className="IconoMetodo">
          <Mail size={18} />
        </span>
        <span className="TextoMetodo">Correo Institucional</span>
      </div>

      {/* Separador visual sutil entre opciones */}
      <span className="DivisorMetodos"></span>

      {/* Opción para autenticación por Cédula */}
      <div className="OpcionMetodoItem">
        <span className="IconoMetodo">
          <IdCard size={18} />
        </span>
        <span className="TextoMetodo">Número de Cédula</span>
      </div>

    </nav>
  );
};

export default SelectorMetodoModerno;
