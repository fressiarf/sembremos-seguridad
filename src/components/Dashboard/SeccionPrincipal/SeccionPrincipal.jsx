import React from 'react';
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
import { FileText, Download } from 'lucide-react';
import Calendario from '../../Calendario/Calendario';

// Mapeo de vistas a nombres de sección para el TopbarInstitucion
const VIEW_LABELS = {
  dashboard:    'Dashboard Global',
  actividades:  'Actividad Oficiales',
  usuarios:     'Gestión de Usuarios',
  perfil:       'Mi Perfil',
  matrices:     'Todas las Matrices',
  zonas:        'Zonas Críticas',
  incidentes:   'Incidentes',
  alertas:      'Alertas Activas',
  mapa:         'Mapa de Riesgos',
  estadisticas: 'Estadísticas',
  calendario:   'Calendario de Operaciones',
  reportes:     'Reportes INL/MSP',
  historial:    'Historial de Reportes',
  configuracion:'Configuración',
  lineas:       'Mis Tareas / Líneas de Acción',
};

const SeccionPrincipal = ({ collapsed, activeView }) => {
  const { user } = useLogin();
  const { showToast } = useToast();

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
      {(activeView === 'reportes' || activeView === 'historial') && (
        <div style={{ padding: '2.5rem', color: '#64748b' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1e3a8a' }}>{VIEW_LABELS[activeView]}</h2>
          <div style={{ padding: '3rem', border: '2px dashed #94a3b833', borderRadius: '1.5rem', textAlign: 'center', backgroundColor: '#ffffff05' }}>
            <FileText size={48} style={{ margin: '0 auto 1.5rem', opacity: 0.3 }} />
            <p>Aquí se reflejará el historial consolidado de reportes e incidencias.</p>
          </div>
        </div>
      )}

      {/* Placeholder para otras vistas no mapeadas */}
      {!['dashboard', 'actividades', 'usuarios', 'perfil', 'matrices', 'mapa', 'zonas', 'calendario', 'reportes', 'historial', 'lineas'].includes(activeView) && (
        <div style={{ padding: '2rem', color: '#7a9cc4' }}>
          <h2>Vista en desarrollo: {activeView}</h2>
          <p>Esta sección se implementará próximamente.</p>
        </div>
      )}
    </main>
  );
};

export default SeccionPrincipal;
