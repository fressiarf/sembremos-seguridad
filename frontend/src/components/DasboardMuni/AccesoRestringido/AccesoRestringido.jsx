import React from 'react';
import { ShieldAlert, Lock, ArrowLeft } from 'lucide-react';
import './AccesoRestringido.css';

/**
 * Pantalla de "Acceso Restringido" para cuando un usuario municipal
 * intente acceder a datos de georreferenciación de delitos u operativos.
 *
 * Mensaje redactado con tono institucional y colaborativo, sin ser punitivo.
 */
const AccesoRestringido = ({ onGoBack }) => {
  return (
    <div className="acceso-restringido">
      <div className="acceso-restringido__card">

        {/* Ícono principal */}
        <div className="acceso-restringido__icon-wrapper">
          <div className="acceso-restringido__shield">
            <ShieldAlert size={40} color="#dc2626" strokeWidth={1.5} />
          </div>
          <div className="acceso-restringido__lock">
            <Lock size={16} color="#fff" />
          </div>
        </div>

        {/* Encabezado */}
        <h2 className="acceso-restringido__title">
          Información de Competencia Exclusiva
        </h2>

        {/* Mensaje principal */}
        <p className="acceso-restringido__message">
          La visualización de <strong>incidencia delictiva operativa</strong> y datos de{' '}
          <strong>georreferenciación del delito</strong> es competencia exclusiva de la{' '}
          <strong>Fuerza Pública (Líder Técnico)</strong> por razones de inteligencia técnica
          y protocolos de seguridad nacional.
        </p>

        {/* Separador */}
        <div className="acceso-restringido__divider" />

        {/* Mensaje de rol */}
        <div className="acceso-restringido__role-box">
          <div className="acceso-restringido__role-header">
            <span className="acceso-restringido__role-badge">SOCIO ESTRATÉGICO</span>
          </div>
          <p className="acceso-restringido__role-text">
            Como <strong>Municipalidad</strong>, su rol se enfoca en las{' '}
            <strong>causas estructurales y la prevención social</strong>. Su contribución es fundamental
            para la mitigación de factores de riesgo a través de inversión en infraestructura comunitaria,
            programas preventivos y recuperación de espacios públicos.
          </p>
          <p className="acceso-restringido__role-text" style={{ marginTop: '8px', color: '#475569' }}>
            Los resultados de su gestión alimentan directamente las métricas de impacto compartidas
            con la Fuerza Pública en los informes consolidados del programa Sembremos Seguridad.
          </p>
        </div>

        {/* Acciones disponibles */}
        <div className="acceso-restringido__actions">
          <p className="acceso-restringido__actions-label">
            Módulos disponibles para su rol:
          </p>
          <div className="acceso-restringido__chips">
            <span className="acceso-restringido__chip">📊 Estadísticas de Impacto</span>
            <span className="acceso-restringido__chip">🏗️ Espacios Recuperados</span>
            <span className="acceso-restringido__chip">👥 Población Beneficiada</span>
            <span className="acceso-restringido__chip">💰 Inversión Social</span>
            <span className="acceso-restringido__chip">📋 Reportes Comunitarios</span>
          </div>
        </div>

        {/* Botón de regreso */}
        {onGoBack && (
          <button className="acceso-restringido__btn" onClick={onGoBack}>
            <ArrowLeft size={16} />
            Volver al Resumen Comunitario
          </button>
        )}
      </div>
    </div>
  );
};

export default AccesoRestringido;
