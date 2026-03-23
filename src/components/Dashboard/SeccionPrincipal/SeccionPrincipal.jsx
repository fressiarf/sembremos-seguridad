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
  configuracion:'Configuración',
};

const SeccionPrincipal = ({ collapsed, activeView }) => {
  const { user } = useLogin();

  return (
    <main className={`main-content ${collapsed ? 'main-content--collapsed' : ''}`}>
      <TopbarInstitucion 
        portalTitle={VIEW_LABELS[activeView] || activeView}
        badgeText={user?.rol === 'institucion' ? 'INSTITUCIÓN' : 'ADMINISTRADOR'}
      />

      {activeView === 'dashboard' && <DashboardGlobal />}
      {activeView === 'actividades' && <ActividadOficiales />}
      {activeView === 'usuarios' && <GestionUsuarios />}
      {activeView === 'perfil' && <PerfilUsuario />}
      {activeView === 'matrices' && (
        user?.rol === 'institucion' ? <DashboardInstitucion /> : <MatrizSeguimiento />
      )}
      {activeView === 'mapa' && <MapaRiesgos />}
      {activeView === 'zonas' && <ZonasCriticas />}
      {activeView === 'calendario' && <Calendario />}

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
