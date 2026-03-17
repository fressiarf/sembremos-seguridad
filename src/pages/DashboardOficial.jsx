import React from 'react';
// ─── Layout ───
import LayoutDashboard from '../components/DashboardOficial/Navegacion/LayoutDashboard';

// ─── Navegación ───
import SidebarOficial from '../components/DashboardOficial/Navegacion/SidebarOficial';
import TopbarOficial from '../components/DashboardOficial/Navegacion/TopbarOficial';

// ─── Main Dashboard ───
import StatCardPersonal from '../components/DashboardOficial/MainDashboardOficial/StatCardPersonal';
import ListaMisTareas from '../components/DashboardOficial/MainDashboardOficial/ListaMisTareas';
import GraficoProgresion from '../components/DashboardOficial/MainDashboardOficial/GraficoProgresion';
import ProximosHitos from '../components/DashboardOficial/MainDashboardOficial/ProximosHitos';

const DashboardOficial = () => {
  return (
    <LayoutDashboard sidebar={<SidebarOficial />}>
      {/* 1. Topbar con información del oficial */}
      <TopbarOficial 
        seccion="Dashboard Oficial" 
        subtitulo="Panel de Gestión de Campo"
        usuario={{ nombre: "Brandon Mora", zona: "Barranca" }}
      />

      {/* 2. Header Flotante (Título y Periodo) */}
      <div className="HeaderFlotanteDashboard">
        <h1>Resumen General</h1>
        <p>Periodo Operativo: 2025 · Sector Acompañado</p>
      </div>

      {/* 3. Fila de Indicadores (StatCards con tipos para CSS) */}
      <section className="GrillaEstadisticas">
        <StatCardPersonal label="Mis Líneas" valor="4" tipo="info" />
        <StatCardPersonal label="Por Reportar" valor="2" tipo="alerta" />
        <StatCardPersonal label="Metas Listas" valor="1" tipo="exito" />
      </section>

      {/* 4. Grilla Principal (Gráfico y Metas) */}
      <div className="GrillaPrincipalDosColumnas">
        <div className="ColumnaOperativa">
          <GraficoProgresion porcentaje={75} />
        </div>
        <div className="ColumnaInformativa">
          <ProximosHitos hito="Taller Preventivo Barranca" fecha="22 Mar" />
        </div>
      </div>

      {/* 5. Lista de Tareas */}
      <ListaMisTareas />

      {/* 6. Badge de Estado Flotante (Opcional, se puede inyectar en Topbar) */}
      <div style={{ position: 'fixed', bottom: '20px', right: '30px', zIndex: 100 }}>
        <div className="EstadoBadge EnEjecucion" style={{ padding: '8px 16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          ● Oficial Activo
        </div>
      </div>
    </LayoutDashboard>
  );
};

export default DashboardOficial;

