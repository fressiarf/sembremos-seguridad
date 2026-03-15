import React from 'react';

const CardAutenticacion = () => {
  return (
    <main className="ContenedorPrincipalLogin">
      
      <section className="TarjetaLogin">
        
        {/* Encabezado de la Tarjeta */}
        <header className="EncabezadoTarjeta">
          <h2 className="TituloBienvenida">¡Ingrese!</h2>
          <p className="InstruccionAcceso">
            Inicia la sesión usando su correo electrónico o cédula
          </p>
        </header>

        {/* Sección del Selector de Método (Email o Cédula) */}
        <div className="SelectorMetodoAutenticacion">
          <div className="OpcionMetodo">
            <input type="radio" id="MetodoEmail" name="tipoAuth" className="InputRadio" />
            <label htmlFor="MetodoEmail" className="LabelMetodo">Email</label>
          </div>
          <div className="OpcionMetodo">
            <input type="radio" id="MetodoCedula" name="tipoAuth" className="InputRadio" />
            <label htmlFor="MetodoCedula" className="LabelMetodo">Cédula</label>
          </div>
        </div>

        {/* Formulario de Datos */}
        <form className="FormularioLogin">
          
          <div className="CampoEntrada">
            <label htmlFor="UsuarioInput" className="LabelCampo">Correo electrónico o Cédula</label>
            <input 
              type="text" 
              id="UsuarioInput" 
              className="InputTexto" 
              placeholder="Ej: usuario@seguridad.go.cr" 
            />
          </div>

          <div className="CampoEntrada">
            <label htmlFor="PasswordInput" className="LabelCampo">Contraseña</label>
            <input 
              type="password" 
              id="PasswordInput" 
              className="InputTexto" 
              placeholder="••••••••" 
            />
          </div>

          {/* Botón de Acción */}
          <div className="SeccionAccionPrincipal">
            <button type="submit" className="BotonIniciarSesion">
              Iniciar Sesión
            </button>
          </div>

        </form>

        {/* Enlaces de Soporte */}
        <footer className="PieTarjetaLogin">
          <a href="#" className="EnlaceRecuperacion">Restablecer una contraseña olvidada</a>
          <p className="TextoRecordatorio">
            Recuerde: Su acceso está siendo monitoreado por seguridad.
          </p>
        </footer>

      </section>

    </main>
  );
};

export default CardAutenticacion;
