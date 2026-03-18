import React from 'react';
import './SeccionPrincipal.css';
import TopbarOficial from '../../DashboardOficial/Navegacion/TopbarOficial';
import DashboardGlobal from '../DashboardGlobal/DashboardGlobal';
import ActividadOficiales from '../ActividadOficiales/ActividadOficiales';
import GestionUsuarios from '../GestionUsuarios/GestionUsuarios';
import PerfilUsuario from '../PerfilUsuario/PerfilUsuario';
import MatrizSeguimiento from '../MatrizSeguimiento/MatrizSeguimiento';
import MapaRiesgos from '../MapaRiesgos/MapaRiesgos';
import ZonasCriticas from '../ZonasCriticas/ZonasCriticas';
import { useLogin } from '../../../context/LoginContext';

// Mapeo de vistas a nombres de sección para el TopbarOficial
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
  calendario:   'Calendario',
  reportes:     'Reportes INL/MSP',
  configuracion:'Configuración',
};

const SeccionPrincipal = ({ collapsed, activeView }) => {
  const { user } = useLogin();

  return (
    <main className={`main-content ${collapsed ? 'main-content--collapsed' : ''}`}>
      <TopbarOficial 
        seccion={VIEW_LABELS[activeView] || activeView}
        subtitulo="Programa Sembremos Seguridad · Portal Oficial de Gestión"
        usuario={{ nombre: user?.nombre || 'C. Araya', zona: user?.rol || 'Administrador' }}
        rol="ADMINISTRADOR"
      />

      {activeView === 'dashboard' && <DashboardGlobal />}
      {activeView === 'actividades' && <ActividadOficiales />}
      {activeView === 'usuarios' && <GestionUsuarios />}
      {activeView === 'perfil' && <PerfilUsuario />}
      {activeView === 'matrices' && <MatrizSeguimiento />}
      {activeView === 'mapa' && <MapaRiesgos />}
      {activeView === 'zonas' && <ZonasCriticas />}

      {/* Placeholder para otras vistas */}
      {activeView !== 'dashboard' && activeView !== 'actividades' && activeView !== 'usuarios' && activeView !== 'perfil' && activeView !== 'matrices' && activeView !== 'mapa' && activeView !== 'zonas' && (
        <div style={{ padding: '2rem', color: '#7a9cc4' }}>
          <h2>Vista en desarrollo: {activeView}</h2>
          <p>Esta sección se implementará próximamente.</p>
        </div>
      )}
    </main>
  );
};

export default SeccionPrincipal;
