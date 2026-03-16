import React from 'react';
import './InputValidar.css';

import { Eye, EyeOff } from 'lucide-react';

const InputValidar = ({ id, label, type, placeholder, Icon }) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const currentType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="ContenedorInputValidar">
      
      <label htmlFor={id} className="LabelValidacion">
        {label}
      </label>
      <div className="CajaEntradaInteractiva">
        <span className="IconoEntrada">
          {Icon && <Icon size={18} strokeWidth={2.5} />}
        </span>
        
        <input 
          type={currentType} 
          id={id} 
          className="InputCampoValidado" 
          placeholder={placeholder} 
        />

        {type === 'password' && (
          <button 
            type="button" 
            className="BotonAccionInput"
            onClick={handleTogglePassword}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      <span className="MensajeErrorValidacion">
        Dato no reconocido
      </span>

    </div>
  );
};

export default InputValidar;
