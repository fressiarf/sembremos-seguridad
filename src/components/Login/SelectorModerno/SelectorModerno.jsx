import React from 'react';
import { useLogin } from '../../../context/LoginContext';
import './SelectorModerno.css';
import { Mail, IdCard } from 'lucide-react';

const SelectorMetodoModerno = () => {
  const { metodo, setMetodo } = useLogin();

  return (
    <nav className="ContenedorSelectorModerno">
      
      {/* Opción para autenticación por Correo */}
      <div 
        className={`OpcionMetodoItem ${metodo === 'email' ? 'ItemActivo' : ''}`}
        onClick={() => setMetodo('email')}
      >
        <span className="IconoMetodo">
          <Mail size={18} />
        </span>
        <span className="TextoMetodo">Correo Institucional</span>
      </div>

      {/* Separador visual sutil entre opciones */}
      <span className="DivisorMetodos"></span>

      {/* Opción para autenticación por Cédula */}
      <div 
        className={`OpcionMetodoItem ${metodo === 'cedula' ? 'ItemActivo' : ''}`}
        onClick={() => setMetodo('cedula')}
      >
        <span className="IconoMetodo">
          <IdCard size={18} />
        </span>
        <span className="TextoMetodo">Número de Cédula</span>
      </div>

    </nav>
  );
};

export default SelectorMetodoModerno;
