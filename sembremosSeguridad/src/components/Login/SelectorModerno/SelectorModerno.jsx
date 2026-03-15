import React from 'react';

const SelectorMetodoModerno = () => {
  return (
    <nav className="ContenedorSelectorModerno">
      
      {/* Opción para autenticación por Correo */}
      <div className="OpcionMetodoItem ItemActivo">
        <span className="IconoMetodo">✉️</span>
        <span className="TextoMetodo">Correo Institucional</span>
      </div>

      {/* Separador visual sutil entre opciones */}
      <span className="DivisorMetodos"></span>

      {/* Opción para autenticación por Cédula */}
      <div className="OpcionMetodoItem">
        <span className="IconoMetodo">🆔</span>
        <span className="TextoMetodo">Número de Cédula</span>
      </div>

    </nav>
  );
};

export default SelectorMetodoModerno;
