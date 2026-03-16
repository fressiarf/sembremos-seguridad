import React from 'react';
import './CardAutenticacion.css';

const CardAutenticacion = ({ children }) => {
  return (
    <main className="ContenedorPrincipalLogin">
      
      <section className="TarjetaLogin">
        
        {children}

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
