import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../../../context/LoginContext';
import './CardAutenticacion.css';
import { ShieldAlert } from 'lucide-react';

const CardAutenticacion = ({ children }) => {
  const navigate = useNavigate();
  const { validateAll } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = validateAll();
    if (user) {
      if (user.rol === 'admin') {
        navigate('/dashboard');
      } else if (user.rol === 'adminInstitucion') {
        navigate('/dashboardAdminInstitucion');
      } else if (user.rol === 'oficial' || user.rol === 'institucion') {
        navigate('/dashboardInstitucion');
      } else {
        navigate('/dashboardInstitucion');
      }
    }
  };

  return (
    <main className="ContenedorPrincipalLogin">
      
      <form onSubmit={handleSubmit} className="TarjetaLogin">
        
        {children}

        <footer className="PieTarjetaLogin">
          <a href="#" className="EnlaceRecuperacion">Restablecer una contraseña olvidada</a>
          
          <div className="ContenedorRecordatorio">
            <div className="IconoTooltipSecurity" data-tooltip="Recuerde: Su acceso está siendo monitoreado por seguridad">
              <ShieldAlert size={18} />
            </div>
          </div>
        </footer>

      </form>

    </main>
  );
};

export default CardAutenticacion;
