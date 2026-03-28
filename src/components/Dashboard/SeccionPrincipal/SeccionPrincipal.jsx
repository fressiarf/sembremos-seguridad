import React, { useState, useEffect, useRef } from 'react';
import './SeccionPrincipal.css';
import TopbarInstitucion from '../../DashboardInstitucion/TopbarInstitucion';
import DashboardGlobal from '../DashboardGlobal/DashboardGlobal';
import ActividadOficiales from '../ActividadOficiales/ActividadOficiales';
import GestionUsuarios from '../GestionUsuarios/GestionUsuarios';
import PerfilUsuario from '../PerfilUsuario/PerfilUsuario';
import DashboardInstitucion from '../../DashboardInstitucion/DashboardInstitucion';
import MapaRiesgos from '../MapaDistribucion/MapaDistribucion';
import ZonasCriticas from '../ZonasCriticas/ZonasCriticas';
import { useLogin } from '../../../context/LoginContext';
import { useToast } from '../../../context/ToastContext';
import { Download, FileText, Bell, Bot } from 'lucide-react';
import Calendario from '../../Shared/Calendario/Calendario';
import NotificacionAdmin from '../NotificacionesAdmin/NotificacionAdmin';
import HistorialReportes from '../../AdminInstitucion/Vistas/HistorialReportes';
import ChatBotWindow from '../../Shared/ChatBot/ChatBotWindow';
import SoporteInstitucional from '../SoporteInstitucional/SoporteInstitucional';
import EstadisticasGlobal from '../Estadisticas/EstadisticasGlobal';

import LineasAccionView from '../LineasAccion/LineasAccionView';
import MatrizSeguimiento from '../LineasAccion/MatrizSeguimiento';
import ReportesResultados from '../LineasAccion/ReportesResultados';
import { ROLES } from '../../../constants/roles';

// Helper inline
const getBadgeText = (rol) => {
  if (rol === ROLES.SUPER_ADMIN) return 'FUERZA PÚBLICA';
  if (rol === ROLES.SUB_ADMIN) return 'MUNICIPALIDAD';
  if (rol === ROLES.ADMIN_INSTITUCION) return 'COORD. INSTITUCIONAL';
  return 'EDITOR';
};

// Mapeo de vistas a nombres de sección para el TopbarInstitucion
const VIEW_LABELS = {
  dashboard: 'Resumen Ejecutivo',
  actividades: 'Gestión de Tareas',
  usuarios: 'Gestión de Usuarios',
  perfil: 'Mi Perfil',
  'matriz-seguimiento': 'Matriz de Seguimiento',
  'reportes-resultados': 'Reportes de Resultados',
  zonas: 'Zonas Críticas',
  alertas: 'Soporte y Comentarios',
  mapa: 'Mapa de Riesgos',
  estadisticas: 'Estadísticas',
  calendario: 'Calendario de Operaciones',
  reportes: 'Reportes INL/MSP',
  historial: 'Historial de Reportes',
  configuracion: 'Configuración',
  'lineas-accion': 'Líneas de Acción',
  lineas: 'Mis Tareas / Líneas de Acción',
};

const SeccionPrincipal = ({ collapsed, setCollapsed, activeView, onViewChange }) => {
  const { user } = useLogin();
  const { showToast } = useToast();
  const [showTopbarNotifs, setShowTopbarNotifs] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const [showChatBot, setShowChatBot] = useState(false);

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
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowTopbarNotifs(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const checkNotifs = () => {
      const guardados = localStorage.getItem('sembremos_seguridad_eventos');
      if (guardados) {
        const evs = JSON.parse(guardados);
        const hoy = new Date();
        const hoyStr = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
        const hoyEvs = evs.filter(e => e.fecha === hoyStr);
        setNotifCount(hoyEvs.length);
      }
    };
    checkNotifs();
    const interval = setInterval(checkNotifs, 3000);
    return () => clearInterval(interval);
  }, []);

  const handlePrintPDF = () => {
    window.print();
    showToast('Generando Ficha de Rendición de Cuentas...', 'info');
  };

  const knownViews = [
    'dashboard', 'actividades', 'usuarios', 'perfil', 'matriz-seguimiento', 
    'reportes-resultados', 'lineas-accion', 'mapa', 'zonas', 'calendario', 
    'reportes', 'historial', 'configuracion', 'alertas', 'estadisticas', 'lineas'
  ];

  return (
    <main className={`main-content ${collapsed ? 'main-content--collapsed' : ''}`}>
      <TopbarInstitucion
        portalTitle={VIEW_LABELS[activeView] || activeView}
        badgeText={getBadgeText(user?.rol)}
      >
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          
          {/* BOTÓN CHAT BOT (Privado para todos los roles) */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={toggleChatBot}
              style={{
                background: showChatBot ? '#002f6c' : 'transparent', 
                border: '1px solid #e2e8f0', 
                cursor: 'pointer', padding: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '50%', transition: 'all 0.2s',
                backgroundColor: showChatBot ? '#002f6c' : '#ffffff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
            >
              <Bot size={22} color={showChatBot ? '#ffffff' : '#002f6c'} />
            </button>
          </div>

          <div ref={notifRef} style={{ position: 'relative' }}>
            <button 
              onClick={toggleDrawer}
              style={{
                background: showTopbarNotifs ? '#002f6c' : 'transparent', 
                border: '1px solid #e2e8f0', cursor: 'pointer', padding: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '50%', transition: 'all 0.2s',
                backgroundColor: showTopbarNotifs ? '#002f6c' : '#ffffff',
                position: 'relative',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              }}
              title="Ver notificaciones de eventos"
            >
               <Bell size={20} color={showTopbarNotifs ? '#ffffff' : '#002f6c'} />
               {notifCount > 0 && (
                 <span style={{ 
                    position: 'absolute', top: '-4px', right: '-4px', 
                    minWidth: '18px', height: '18px', backgroundColor: '#ef4444', 
                    borderRadius: '50%', border: '2px solid white',
                    color: 'white', fontSize: '10px', fontWeight: 'bold',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)'
                 }}>
                   {notifCount}
                 </span>
               )}
            </button>
            
            {showTopbarNotifs && (
               <>
                 <div style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.1)' }} onClick={() => setShowTopbarNotifs(false)}></div>
                 <NotificacionAdmin variant="drawer" />
               </>
            )}
          </div>
          {activeView === 'dashboard' && user?.rol === 'institucion' && (
            <button
              className="btn-report-pdf"
              onClick={handlePrintPDF}
              style={{
                marginLeft: '1rem',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#002f6c',
                fontSize: '0.85rem',
                fontWeight: '600'
              }}
              title="Generar reporte visual para impresión"
            >
              <Download size={18} />
              Generar Rendición de Cuentas
            </button>
          )}
        </div>
      </TopbarInstitucion>

      {showChatBot && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 9998, backgroundColor: 'rgba(0,0,0,0.05)' }} onClick={() => setShowChatBot(false)}></div>
          <ChatBotWindow onClose={() => setShowChatBot(false)} user={user} isDrawer={true} />
        </>
      )}

      {activeView === 'dashboard' && (
        user?.rol === 'institucion' ? <DashboardInstitucion /> : <DashboardGlobal collapsed={collapsed} onViewChange={onViewChange} />
      )}
      {activeView === 'actividades' && <ActividadOficiales />}
      {activeView === 'usuarios' && <GestionUsuarios />}
      {activeView === 'perfil' && <PerfilUsuario />}
      {activeView === 'matriz-seguimiento' && <MatrizSeguimiento />}
      {activeView === 'reportes-resultados' && <ReportesResultados />}
      {activeView === 'lineas-accion' && <LineasAccionView onViewChange={onViewChange} />}
      {activeView === 'mapa' && <MapaRiesgos />}
      {activeView === 'zonas' && <ZonasCriticas />}
      {activeView === 'calendario' && <Calendario />}
      {activeView === 'alertas' && <SoporteInstitucional />}
      {activeView === 'estadisticas' && <EstadisticasGlobal />}
      {(activeView === 'reportes' || activeView === 'historial') && (
        <HistorialReportes isGlobal={true} />
      )}


      {/* Placeholder para otras vistas no mapeadas */}
      {!knownViews.includes(activeView) && (
        <div style={{ padding: '2rem', color: '#7a9cc4' }}>
          <h2>Vista en desarrollo: {activeView}</h2>
          <p>Esta sección se implementará próximamente.</p>
        </div>
      )}
    </main>
  );
};



export default SeccionPrincipal;
