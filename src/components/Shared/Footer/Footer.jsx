import React from 'react';
import './Footer.css';
import mspLogo from '../../../assets/Msp_logo-removebg-preview.png';
import inlLogo from '../../../assets/inl-logo-acronym-vertical-navy-removebg-preview.png';

const Footer = ({ onViewChange }) => {
    const currentYear = new Date().getFullYear();

    const handleViewChange = (view) => (e) => {
        e.preventDefault();
        if (onViewChange) {
            onViewChange(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <footer className="footer-institutional">
            <div className="footer-container">
                {/* Brand Section - Ahora más integrada */}
                <div className="footer-brand">
                    <div className="footer-logos-container">
                        <img src={mspLogo} alt="MSP Logo" className="footer-logo" />
                        <img src={inlLogo} alt="INL Logo" className="footer-logo" />
                    </div>
                    <div className="footer-brand-text">
                        <h3>Sembremos Seguridad</h3>
                        <p>Plataforma de inteligencia institucional para la gestión de seguridad y convivencia ciudadana.</p>
                    </div>
                </div>

                {/* Grid de Enlaces - Mejor distribución */}
                <div className="footer-links-grid">
                    <div className="footer-column">
                        <h4>Soporte y Contacto</h4>
                        <ul>
                            <li><a href="tel:25810123">Ticketing de TI (2581-0123)</a></li>
                            <li><a href="mailto:soporte@seguridad.go.cr">Soporte de RRHH</a></li>
                            <li><a href="#directorio" onClick={handleViewChange('usuarios')}>Directorio Institucional</a></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h4>Enlaces Rápidos</h4>
                        <ul>
                            <li><a href="#politicas">Políticas Internas</a></li>
                            <li><a href="#portal" onClick={handleViewChange('perfil')}>Portal del Empleado</a></li>
                            <li><a href="#directorio" onClick={handleViewChange('usuarios')}>Directorio de la Empresa</a></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h4>Mapa del Sitio</h4>
                        <ul>
                            <li><a href="#dashboard" onClick={handleViewChange('dashboard')}>Panel de Control</a></li>
                            <li><a href="#tareas" onClick={handleViewChange('tareas')}>Gestión de Actividades</a></li>
                            <li><a href="#calendario" onClick={handleViewChange('calendario')}>Calendario Institucional</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar con integración de colores */}
            <div className="footer-bottom">
                <div className="footer-bottom-content">
                    <p>&copy; {currentYear} Sembremos Seguridad. Todos los derechos reservados.</p>
                    <div className="footer-v-line"></div>
                    <p>Ministerio de Seguridad Pública | INL</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
