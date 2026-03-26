import React, { useState, useEffect, useRef } from 'react';
import './SeccionPrincipal.css';
import TopbarInstitucion from '../../DashboardInstitucion/TopbarInstitucion';
import DashboardGlobal from '../DashboardGlobal/DashboardGlobal';
import ActividadOficiales from '../ActividadOficiales/ActividadOficiales';
import GestionUsuarios from '../GestionUsuarios/GestionUsuarios';
import PerfilUsuario from '../PerfilUsuario/PerfilUsuario';
import MatrizSeguimiento from '../MatrizSeguimiento/MatrizSeguimiento';
import DashboardInstitucion from '../../DashboardInstitucion/DashboardInstitucion';
import MapaRiesgos from '../MapaRiesgos/MapaRiesgos';
import ZonasCriticas from '../ZonasCriticas/ZonasCriticas';
import { useLogin } from '../../../context/LoginContext';
import { useToast } from '../../../context/ToastContext';
import { Download, FileText, Bell } from 'lucide-react';
import Calendario from '../../Calendario/Calendario';
import NotificacionAdmin from '../NotificacionesAdmin/NotificacionAdmin';
import HistorialReportes from '../../AdminInstitucion/Vistas/HistorialReportes';
import SoporteInstitucional from '../SoporteInstitucional/SoporteInstitucional';
import EstadisticasGlobal from '../Estadisticas/EstadisticasGlobal';

// Mapeo de vistas a nombres de sección para el TopbarInstitucion
const VIEW_LABELS = {
  dashboard: 'Dashboard Global',
  actividades: 'Actividad Oficiales',
  usuarios: 'Gestión de Usuarios',
  perfil: 'Mi Perfil',
  matrices: 'Todas las Matrices',
  zonas: 'Zonas Críticas',
  incidentes: 'Incidentes',
  alertas: 'Soporte y Comentarios',
  mapa: 'Mapa de Riesgos',
  estadisticas: 'Estadísticas',
  calendario: 'Calendario de Operaciones',
  reportes: 'Reportes INL/MSP',
  historial: 'Historial de Reportes',
  lineas: 'Mis Tareas / Líneas de Acción',
};

const SeccionPrincipal = ({ collapsed, setCollapsed, activeView }) => {
  const { user } = useLogin();
  const { showToast } = useToast();
  const [showTopbarNotifs, setShowTopbarNotifs] = useState(false);
  const [notifCount, setNotifCount] = useState(0);

  const toggleDrawer = () => {
    setShowTopbarNotifs(prev => {
      const isOpening = !prev;
      if (isOpening && setCollapsed) {
        setCollapsed(true);
      }
      return isOpening;
    });
  };
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

  return (
    <main className={`main-content ${collapsed ? 'main-content--collapsed' : ''}`}>
      <TopbarInstitucion
        portalTitle={VIEW_LABELS[activeView] || activeView}
        badgeText={user?.rol === 'institucion' ? 'INSTITUCIÓN' : 'ADMINISTRADOR'}
      >
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div ref={notifRef} style={{ position: 'relative' }}>
            <button 
              onClick={toggleDrawer}
              style={{
                background: 'transparent', border: '1px solid #e2e8f0', cursor: 'pointer', padding: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '50%', transition: 'all 0.2s',
                backgroundColor: '#ffffff',
                position: 'relative',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.boxShadow = '0 3px 6px rgba(0,0,0,0.08)'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'; }}
              title="Ver notificaciones de eventos"
            >
               <Bell size={20} color="#002f6c" />
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
            title="Generar reporte visual para impresión"
          >
            <Download size={18} />
            Generar Rendición de Cuentas
          </button>
        )}
        </div>
      </TopbarInstitucion>

      {activeView === 'dashboard' && (
        user?.rol === 'institucion' ? <DashboardInstitucion /> : <DashboardGlobal collapsed={collapsed} />
      )}
      {activeView === 'actividades' && <ActividadOficiales />}
      {activeView === 'usuarios' && <GestionUsuarios />}
      {activeView === 'perfil' && <PerfilUsuario />}
      {activeView === 'matrices' && (
        user?.rol === 'institucion' ? <DashboardInstitucion /> : <MatrizSeguimiento />
      )}
      {activeView === 'lineas' && user?.rol === 'institucion' && <DashboardInstitucion />}
      {activeView === 'mapa' && <MapaRiesgos />}
      {activeView === 'zonas' && <ZonasCriticas />}
      {activeView === 'calendario' && <Calendario />}
      {activeView === 'alertas' && <SoporteInstitucional />}
      {activeView === 'estadisticas' && <EstadisticasGlobal />}
      {(activeView === 'reportes' || activeView === 'historial') && (
        <HistorialReportes isGlobal={true} />
      )}


      {/* Placeholder para otras vistas no mapeadas */}
      {!['dashboard', 'actividades', 'usuarios', 'perfil', 'matrices', 'mapa', 'zonas', 'calendario', 'reportes', 'historial', 'lineas', 'alertas', 'estadisticas'].includes(activeView) && (
        <div style={{ padding: '2rem', color: '#7a9cc4' }}>
          <h2>Vista en desarrollo: {activeView}</h2>
          <p>Esta sección se implementará próximamente.</p>
        </div>
      )}
    </main>
  );
};

export default SeccionPrincipal;
