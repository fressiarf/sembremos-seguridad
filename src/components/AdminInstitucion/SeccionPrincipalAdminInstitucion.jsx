import React from 'react';
import DashboardAdminInst from './Vistas/DashboardAdminInst';
import GestionTareas from './Vistas/GestionTareas';
import RevisionReportes from './Vistas/RevisionReportes';
import HistorialReportes from './Vistas/HistorialReportes';
import CalendarioAdminInst from './Vistas/CalendarioAdminInst';
import GestionFuncionarios from './Vistas/GestionFuncionarios';
import PerfilUsuario from '../Dashboard/PerfilUsuario/PerfilUsuario';
import EstadisticasInstitucion from './Vistas/EstadisticasInstitucion';
import TopbarInstitucion from '../DashboardInstitucion/Navegacion/TopbarInstitucion';
import { useLogin } from '../../context/LoginContext';

const SeccionPrincipalAdminInstitucion = ({ activeView = 'dashboard' }) => {
  const { user } = useLogin();

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
        return <CalendarioAdminInst />;
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
      />
      {renderView()}
    </>
  );
};

export default SeccionPrincipalAdminInstitucion;
