import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
      if (typeof setShowSuccess === 'function') setShowSuccess(true);
      
      setTimeout(() => {
        if (user.rol === 'admin') {
          navigate('/dashboard');
        } else if (user.rol === 'adminInstitucion') {
          navigate('/dashboardAdminInstitucion');
        } else if (user.rol === 'institucion' || user.rol === 'oficial' || user.rol === 'editor') {
          navigate('/dashboardEditores');
        } else {
          navigate('/dashboardEditores');
        }
      }, 500);
    }
  };

  return (
    <main className="ContenedorPrincipalLogin">
      
      <form onSubmit={handleSubmit} className="TarjetaLogin">
        
        {children}

        <footer className="PieTarjetaLogin">
          <Link to="/soporte-acceso" className="EnlaceRecuperacion">¿Problemas para ingresar?</Link>
          
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
