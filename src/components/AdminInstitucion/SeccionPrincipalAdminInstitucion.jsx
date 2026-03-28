import React from 'react';
import DashboardAdminInst from './Vistas/DashboardAdminInst';
import GestionTareas from './Vistas/GestionTareas';
import RevisionReportes from './Vistas/RevisionReportes';
import HistorialReportes from './Vistas/HistorialReportes';
import Calendario from '../Shared/Calendario/Calendario';
import GestionFuncionarios from './Vistas/GestionFuncionarios';
import PerfilUsuario from '../Dashboard/PerfilUsuario/PerfilUsuario';
import EstadisticasInstitucion from './Vistas/EstadisticasInstitucion';
import TopbarInstitucion from '../DashboardInstitucion/Navegacion/TopbarInstitucion';
import { useLogin } from '../../context/LoginContext';
import { useState, useEffect, useRef } from 'react';
import { Bot, Bell, X } from 'lucide-react';
import ChatBotWindow from '../Shared/ChatBot/ChatBotWindow';
import NotificacionAdmin from '../Dashboard/NotificacionesAdmin/NotificacionAdmin';

const SeccionPrincipalAdminInstitucion = ({ activeView = 'dashboard', collapsed, setCollapsed }) => {
  const { user } = useLogin();
  const [showTopbarNotifs, setShowTopbarNotifs] = useState(false);
  const [showChatBot, setShowChatBot] = useState(false);
  const notifRef = useRef(null);

  const toggleDrawer = () => setShowTopbarNotifs(prev => !prev);
  const toggleChatBot = () => setShowChatBot(prev => !prev);

  // Efecto para manejar la exclusividad y el colapso del sidebar
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

  const getSeccionLabel = () => {
    const labels = {
      dashboard: 'Dashboard',
      tareas: 'Gestión de Tareas',
      usuarios: 'Gestión de Funcionarios',
      reportes: 'Revisión de Reportes',
      historial: 'Historial de Reportes',
      calendario: 'Calendario',
      estadisticas: 'Estadísticas',
      perfil: 'Mi Perfil',
    };
    return labels[activeView] || 'Dashboard';
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardAdminInst />;
      case 'tareas':
        return <GestionTareas />;
      case 'usuarios':
        return <GestionFuncionarios />;
      case 'reportes':
        return <RevisionReportes />;
      case 'historial':
        return <HistorialReportes />;
      case 'calendario':
        return (
          <div style={{ padding: '1rem 2rem' }}>
             <Calendario />
          </div>
        );
      case 'estadisticas':
        return <EstadisticasInstitucion />;
      case 'perfil':
        return (
          <div style={{ padding: '2rem 2.5rem' }}>
            <PerfilUsuario />
          </div>
        );
      default:
        return <DashboardAdminInst />;
    }
  };

  return (
    <>
      <TopbarInstitucion
        usuario={user}
        seccion={getSeccionLabel()}
        subtitulo="Portal Admin Institución"
        rol={`ADMIN · ${user?.institucion || 'INSTITUCIÓN'}`}
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

export default SeccionPrincipalAdminInstitucion;
