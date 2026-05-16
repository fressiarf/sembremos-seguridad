import React from 'react';
import { useLogin } from '../../../context/LoginContext';
import './InputValidar.css';
import { Lock, Eye, EyeOff, Mail, AlertCircle, IdCard } from 'lucide-react';

const InputValidar = () => {
  const { formData, setFormData, errors, setErrors, loginMethod, setLoginMethod } = useLogin();
  const [showPassword, setShowPassword] = React.useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMethodChange = (method) => {
    if (method === loginMethod) return;
    setLoginMethod(method);
    // Limpiar el campo de identificador al cambiar de método
    setFormData(prev => ({ ...prev, identificador: '' }));
    setErrors({ identificador: '', password: '' });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    let name = '';
    
    if (id === 'EntradaIdentificador') name = 'identificador';
    else if (id === 'EntradaPassword') name = 'password';
    
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiamos el error del campo que se está editando
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const isGenericError = errors.identificador === 'Las credenciales son incorrectas';

  return (
    <div className="SeccionEntradasValidar">
      
      {/* Selector de Método de Autenticación (Tabs) */}
      <div className="SelectorMetodoAuth">
        <button
          type="button"
          className={`TabMetodo ${loginMethod === 'email' ? 'TabMetodoActivo' : ''}`}
          onClick={() => handleMethodChange('email')}
        >
          <Mail size={15} />
          <span>Correo</span>
        </button>
        <button
          type="button"
          className={`TabMetodo ${loginMethod === 'cedula' ? 'TabMetodoActivo' : ''}`}
          onClick={() => handleMethodChange('cedula')}
        >
          <IdCard size={15} />
          <span>Cédula</span>
        </button>
        <div 
          className="IndicadorTabActivo" 
          style={{ transform: loginMethod === 'cedula' ? 'translateX(100%)' : 'translateX(0)' }}
        />
      </div>

      {/* Alerta de Error Global (Solo para errores de seguridad/credenciales) */}
      {isGenericError && (
        <div className="AlertaErrorGlobal animacion-entrada-error">
          <div className="ContenedorIconoError">
            <AlertCircle size={18} />
          </div>
          <div className="ContenidoError">
            <strong className="TituloError">Error de acceso</strong>
            <p className="TextoError">Las credenciales son incorrectas.</p>
          </div>
        </div>
      )}

      {/* Entrada de Identificador (Email o Cédula según el tab seleccionado) */}
      <div className="ContenedorInputValidar">
        <label htmlFor="EntradaIdentificador" className="LabelValidacion">
          {loginMethod === 'email' ? 'Correo Institucional' : 'Número de Cédula'}
        </label>
        <div className={`CajaEntradaInteractiva ${errors.identificador ? 'CajaError' : ''}`}>
          <span className="IconoEntrada">
            {loginMethod === 'email' ? <Mail size={18} /> : <IdCard size={18} />}
          </span>
          <input 
            type={loginMethod === 'email' ? 'email' : 'text'}
            id="EntradaIdentificador" 
            className="InputCampoValidado" 
            placeholder={loginMethod === 'email' ? 'Ej: usuario@sembremosseguridad.go.cr' : 'Ej: 102340567'}
            value={formData.identificador}
            onChange={handleChange}
            inputMode={loginMethod === 'cedula' ? 'numeric' : undefined}
            autoComplete={loginMethod === 'email' ? 'email' : 'off'}
          />
          {errors.identificador === 'campo-vacio' && (
            <div className="BurbujaAlertaNativa">
              <div className="IconoAdvertenciaNaranja">!</div>
              <span className="TextoBurbujaNativa">Rellene este campo.</span>
            </div>
          )}
        </div>
        {errors.identificador && errors.identificador !== 'Las credenciales son incorrectas' && errors.identificador !== 'campo-vacio' && (
          <span className="MensajeErrorValidacion">{errors.identificador}</span>
        )}
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
          {errors.password === 'campo-vacio' && (
            <div className="BurbujaAlertaNativa">
              <div className="IconoAdvertenciaNaranja">!</div>
              <span className="TextoBurbujaNativa">Rellene este campo.</span>
            </div>
          )}
        </div>
        {errors.password && errors.password !== 'Las credenciales son incorrectas' && errors.password !== 'campo-vacio' && (
          <span className="MensajeErrorValidacion">{errors.password}</span>
        )}
      </div>

    </div>
  );
};

export default InputValidar;
