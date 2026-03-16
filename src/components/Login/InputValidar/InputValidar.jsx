import React from 'react';
import './InputValidar.css';
import { User, Lock, Eye, EyeOff } from 'lucide-react';

const InputValidar = () => {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="SeccionEntradasValidar">
      
      {/* Entrada de Usuario / Email */}
      <div className="ContenedorInputValidar">
        <label htmlFor="EntradaUsuario" className="LabelValidacion">
          Correo Electrónico o Cédula
        </label>
        <div className="CajaEntradaInteractiva">
          <span className="IconoEntrada">
            <User size={18} strokeWidth={2.5} />
          </span>
          <input 
            type="text" 
            id="EntradaUsuario" 
            className="InputCampoValidado" 
            placeholder="Ej: usuario@seguridad.go.cr" 
          />
        </div>
        <span className="MensajeErrorValidacion">Dato no reconocido</span>
      </div>

      {/* Entrada de Contraseña */}
      <div className="ContenedorInputValidar">
        <label htmlFor="EntradaPassword" className="LabelValidacion">
          Contraseña
        </label>
        <div className="CajaEntradaInteractiva">
          <span className="IconoEntrada">
            <Lock size={18} strokeWidth={2.5} />
          </span>
          <input 
            type={showPassword ? "text" : "password"} 
            id="EntradaPassword" 
            className="InputCampoValidado" 
            placeholder="••••••••" 
          />
          <button 
            type="button" 
            className="BotonAccionInput"
            onClick={handleTogglePassword}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <span className="MensajeErrorValidacion">Contraseña incorrecta</span>
      </div>

    </div>
  );
};

export default InputValidar;
