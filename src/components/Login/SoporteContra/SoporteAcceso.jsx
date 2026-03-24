import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldOff,
  Users,
  MessageCircle,
  Lock,
  KeyRound,
  Phone,
  Mail,
  ArrowLeft,
  Send,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import logoMsp from '../../../assets/Msp_logo-removebg-preview.png';
import logoInl from '../../../assets/inl-logo-acronym-vertical-navy-removebg-preview.png';
import logoSembremos from '../../../assets/Captura_de_pantalla_2026-03-15_191337-removebg-preview.png';
import './SoporteAcceso.css';

const SoporteAcceso = () => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');

  const handleEnviar = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correo) {
      setError('El correo institucional es requerido.');
      return;
    }
    if (!emailRegex.test(correo)) {
      setError('Ingrese un formato de correo válido.');
      return;
    }
    setError('');

    // Guardar solicitud en localStorage para que el admin la vea
    const solicitudes = JSON.parse(localStorage.getItem('solicitudes_acceso') || '[]');
    solicitudes.push({
      id: Date.now(),
      correo,
      fecha: new Date().toLocaleString('es-CR'),
      estado: 'pendiente',
    });
    localStorage.setItem('solicitudes_acceso', JSON.stringify(solicitudes));

    setEnviado(true);
  };

  const pasos = [
    {
      num: 1,
      icon: Users,
      titulo: 'Identifique a su Superior Inmediato',
      desc: 'Jefe de Delegación o de Sección de su unidad.',
    },
    {
      num: 2,
      icon: MessageCircle,
      titulo: 'Solicite verbalmente un "Reseteo de Clave"',
      desc: 'Explíquele que ha perdido el acceso a su cuenta institucional.',
    },
    {
      num: 3,
      icon: Lock,
      titulo: 'Superior gestiona la nueva clave',
      desc: 'El superior ingresa a la Intranet y genera una clave temporal para usted.',
    },
    {
      num: 4,
      icon: KeyRound,
      titulo: 'Cambie la clave temporal de inmediato',
      desc: 'Al ingresar con la nueva clave, cámbiela de inmediato desde su perfil.',
    },
  ];

  return (
    <main className="soporte-bg">
      <div className="soporte-card">

        {/* Header logos */}
        <div className="soporte-header">
          <div className="soporte-logos">
            <img src={logoMsp} alt="MSP" className="soporte-logo" />
            <img src={logoInl} alt="INL" className="soporte-logo" />
            <img src={logoSembremos} alt="Sembremos Seguridad" className="soporte-logo" />
          </div>
          <div className="soporte-brand">
            <span className="soporte-brand-title">SEMBREMOS</span>
            <span className="soporte-brand-sub">SEGURIDAD</span>
          </div>
        </div>

        {/* Título */}
        <div className="soporte-titulo-bloque">
          <ShieldOff size={28} className="soporte-titulo-icon" />
          <div>
            <h1 className="soporte-titulo">Ayuda para Restablecer Acceso</h1>
            <p className="soporte-subtitulo">
              Por motivos de seguridad institucional, el restablecimiento automático no está disponible. Siga los pasos detallados a continuación.
            </p>
          </div>
        </div>

        {/* Aviso */}
        <div className="soporte-aviso">
          <AlertCircle size={20} className="soporte-aviso-icon" />
          <div>
            <strong>Restablecimiento Automático Desactivado</strong>
            <p>Para su seguridad y la de la institución, solo un <strong>Administrador o Superior de Delegación</strong> puede gestionar una nueva clave temporal para usted.</p>
          </div>
        </div>

        {/* Pasos */}
        <div className="soporte-pasos">
          {pasos.map((paso) => {
            const Icono = paso.icon;
            return (
              <div key={paso.num} className="soporte-paso">
                <div className="soporte-paso-num">{paso.num}</div>
                <div className="soporte-paso-contenido">
                  <div className="soporte-paso-header">
                    <Icono size={16} className="soporte-paso-icono" />
                    <strong>{paso.titulo}</strong>
                  </div>
                  <p className="soporte-paso-desc">{paso.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Formulario de solicitud */}
        <div className="soporte-form-bloque">
          <h2 className="soporte-form-titulo">
            <Send size={17} />
            Enviar solicitud al área de soporte
          </h2>
          {!enviado ? (
            <form onSubmit={handleEnviar} className="soporte-form">
              <label htmlFor="soporte-correo" className="soporte-label">
                Correo Institucional
              </label>
              <div className={`soporte-input-wrap ${error ? 'soporte-input-error' : ''}`}>
                <Mail size={16} className="soporte-input-icon" />
                <input
                  id="soporte-correo"
                  type="text"
                  className="soporte-input"
                  placeholder="usuario@seguridad.go.cr"
                  value={correo}
                  onChange={(e) => { setCorreo(e.target.value); setError(''); }}
                />
              </div>
              {error && <span className="soporte-error-msg">{error}</span>}
              <button type="submit" className="soporte-btn-enviar">
                <Send size={16} />
                Enviar Solicitud de Soporte
              </button>
            </form>
          ) : (
            <div className="soporte-enviado">
              <CheckCircle size={32} className="soporte-enviado-icon" />
              <p>Solicitud enviada para <strong>{correo}</strong>. Un administrador se comunicará a la brevedad.</p>
            </div>
          )}
        </div>

        {/* Nota de seguridad */}
        <div className="soporte-nota">
          <AlertCircle size={16} />
          <p>Por seguridad institucional, no use redes sociales ni correos personales. Use solo los canales oficiales aquí listados para contacto directo si el superior no responde.</p>
        </div>

        {/* Canales */}
        <div className="soporte-canales">
          <h3 className="soporte-canales-titulo">Canales de Soporte Directo</h3>
          <div className="soporte-canales-lista">
            <a href="tel:25810123" className="soporte-canal-item">
              <Phone size={15} />
              Mesa de Ayuda (MSP): 2581-0123
            </a>
            <a href="mailto:soporte@seguridad.go.cr" className="soporte-canal-item">
              <Mail size={15} />
              Soporte Técnico: soporte@seguridad.go.cr
            </a>
          </div>
        </div>

        {/* Volver */}
        <button className="soporte-btn-volver" onClick={() => navigate('/')}>
          <ArrowLeft size={16} />
          Volver al Ingreso
        </button>

      </div>
    </main>
  );
};

export default SoporteAcceso;
