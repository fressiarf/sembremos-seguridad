import React from 'react';
import { useLogin } from '../../../context/LoginContext';
import './InputValidar.css';
import { Lock, Eye, EyeOff, Mail } from 'lucide-react';

const InputValidar = () => {
  const { formData, setFormData, errors, setErrors } = useLogin();
  const [showPassword, setShowPassword] = React.useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    const name = id === 'EntradaUsuario' ? 'usuario' : 'password';
    
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiamos el error del campo que se está editando
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="SeccionEntradasValidar">
      
      {/* Entrada de Correo Institucional */}
      <div className="ContenedorInputValidar">
        <label htmlFor="EntradaUsuario" className="LabelValidacion">
          Correo Institucional
        </label>
        <div className={`CajaEntradaInteractiva ${errors.usuario ? 'CajaError' : ''}`}>
          <span className="IconoEntrada">
            <Mail size={18} />
          </span>
          <input 
            type="text" 
            id="EntradaUsuario" 
            className="InputCampoValidado" 
            placeholder="Ej: usuario@seguridad.go.cr"
            value={formData.usuario}
            onChange={handleChange}
          />
        </div>
        {errors.usuario && <span className="MensajeErrorValidacion">{errors.usuario}</span>}
      </div>

      {/* Entrada de Contraseña */}
      <div className="ContenedorInputValidar">
        <label htmlFor="EntradaPassword" className="LabelValidacion">
          Contraseña
        </label>
        <div className={`CajaEntradaInteractiva ${errors.password ? 'CajaError' : ''}`}>
          <span className="IconoEntrada">
            <Lock size={18} strokeWidth={2.5} />
          </span>
          <input 
            type={showPassword ? "text" : "password"} 
            id="EntradaPassword" 
            className="InputCampoValidado" 
            placeholder="••••••••" 
            value={formData.password}
            onChange={handleChange}
          />
          <button 
            type="button" 
            className="BotonAccionInput"
            onClick={handleTogglePassword}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <span className="MensajeErrorValidacion">{errors.password}</span>}
      </div>

    </div>
  );
};

export default InputValidar;
