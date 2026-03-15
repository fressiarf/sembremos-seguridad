import React from 'react';

const InputValidar = () => {
  return (
    <div className="ContenedorInputValidar">
      
      {/* Etiqueta del campo */}
      <label htmlFor="EntradaPrincipal" className="LabelValidacion">
        Identificación Institucional
      </label>

      {/* Caja que agrupa el icono y el input */}
      <div className="CajaEntradaInteractiva">
        <span className="IconoEntrada">👤</span>
        
        <input 
          type="text" 
          id="EntradaPrincipal" 
          className="InputCampoValidado" 
          placeholder="Ingrese su correo o cédula" 
        />

        {/* Espacio para el icono de "ver contraseña" o "check" verde */}
        <button type="button" className="BotonAccionInput">
          👁️
        </button>
      </div>

      {/* Mensaje de error o validación (se mostrará cuando sea necesario) */}
      <span className="MensajeErrorValidacion">
        Formato de identificación no reconocido
      </span>

    </div>
  );
};

export default InputValidar;
