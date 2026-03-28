import React, { useState, useEffect, useRef } from 'react';
import ResumenComunitario from '../ResumenComunitario/ResumenComunitario';
import ActividadesPreventivas from '../ActividadesPreventivas/ActividadesPreventivas';
import LineasAccionMuni from '../LineasAccionMuni/LineasAccionMuni';
import ReportesComunitarios from '../ReportesComunitarios/ReportesComunitarios';
import HistorialMuni from '../HistorialMuni/HistorialMuni';
import EstadisticasMuni from '../EstadisticasMuni/EstadisticasMuni';
import AccesoRestringido from '../AccesoRestringido/AccesoRestringido';
import Calendario from '../../Calendario/Calendario';
import PerfilUsuario from '../../Dashboard/PerfilUsuario/PerfilUsuario';
import SoporteInstitucional from '../../Dashboard/SoporteInstitucional/SoporteInstitucional';
import TopbarInstitucion from '../../DashboardInstitucion/TopbarInstitucion';
import { useLogin } from '../../../context/LoginContext';
import { Bot, Bell } from 'lucide-react';
import ChatBotWindow from '../../Shared/ChatBot/ChatBotWindow';
import NotificacionAdmin from '../../Dashboard/NotificacionesAdmin/NotificacionAdmin';

const VIEW_LABELS = {
  dashboard: 'Resumen Comunitario',
  actividades: 'Actividades Preventivas',
  lineas: 'Líneas de Acción',
  reportes: 'Reportes Comunitarios',
  historial: 'Historial de Actividades',
  alertas: 'Soporte y Comentarios',
  estadisticas: 'Estadísticas de Impacto',
  calendario: 'Calendario',
  perfil: 'Mi Perfil',
};

const SeccionPrincipalMuni = ({ activeView = 'dashboard', collapsed, setCollapsed, onViewChange }) => {
  const { user } = useLogin();
  const [showTopbarNotifs, setShowTopbarNotifs] = useState(false);
  const [showChatBot, setShowChatBot] = useState(false);
  const notifRef = useRef(null);

  const toggleDrawer = () => setShowTopbarNotifs(prev => !prev);
  const toggleChatBot = () => setShowChatBot(prev => !prev);

  useEffect(() => {
    if (showTopbarNotifs) {
      setShowChatBot(false);
      if (setCollapsed) setCollapsed(true);
    }
  }, [showTopbarNotifs, setCollapsed]);

  useEffect(() => {
    if (showChatBot) {
      setShowTopbarNotifs(false);
      if (setCollapsed) setCollapsed(true);
    }
  }, [showChatBot, setCollapsed]);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <ResumenComunitario />;
      case 'actividades':
        return <ActividadesPreventivas />;
      case 'lineas':
        return <LineasAccionMuni />;
      case 'reportes':
        return <ReportesComunitarios />;
      case 'historial':
        return <HistorialMuni />;
      case 'estadisticas':
        return <EstadisticasMuni />;
      case 'calendario':
        return (
          <div style={{ padding: '1rem 2rem' }}>
            <Calendario />
          </div>
        );
      case 'alertas':
        return (
          <div style={{ padding: '2rem 2.5rem' }}>
            <SoporteInstitucional />
          </div>
        );
      case 'perfil':
        return (
          <div style={{ padding: '2rem 2.5rem' }}>
            <PerfilUsuario />
          </div>
        );
      // ── Vistas restringidas (Seguridad/Delitos) ──
      case 'delitos':
      case 'mapa':
      case 'zonas':
      case 'distribucion':
        return <AccesoRestringido onGoBack={() => onViewChange && onViewChange('dashboard')} />;
      default:
        return <ResumenComunitario />;
    }
  };

  return (
    <>
      <TopbarInstitucion
        portalTitle={VIEW_LABELS[activeView] || activeView}
        badgeText="MUNICIPALIDAD"
      >
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginLeft: '1rem' }}>
          <button
            onClick={toggleChatBot}
            style={{
              background: showChatBot ? '#002f6c' : 'transparent',
              border: '1px solid #e2e8f0',
              cursor: 'pointer', padding: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '50%', transition: 'all 0.2s',
              backgroundColor: showChatBot ? '#002f6c' : '#ffffff',
            }}
          >
            <Bot size={20} color={showChatBot ? '#ffffff' : '#002f6c'} />
          </button>

          <div ref={notifRef} style={{ position: 'relative' }}>
            <button
              onClick={toggleDrawer}
              style={{
                background: showTopbarNotifs ? '#002f6c' : 'transparent',
                border: '1px solid #e2e8f0',
                cursor: 'pointer', padding: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '50%', transition: 'all 0.2s',
                backgroundColor: showTopbarNotifs ? '#002f6c' : '#ffffff',
              }}
            >
              <Bell size={20} color={showTopbarNotifs ? '#ffffff' : '#002f6c'} />
            </button>
          </div>
        </div>
      </TopbarInstitucion>

      {showTopbarNotifs && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.1)' }} onClick={() => setShowTopbarNotifs(false)}></div>
          <NotificacionAdmin variant="drawer" />
        </>
      )}

      {showChatBot && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 9998, backgroundColor: 'rgba(0,0,0,0.05)' }} onClick={() => setShowChatBot(false)}></div>
          <ChatBotWindow onClose={() => setShowChatBot(false)} user={user} />
        </>
      )}

      {renderView()}
    </>
  );
};

export default SeccionPrincipalMuni;
