import React, { useState, useEffect } from 'react';
import './DashboardOficial.css';
import TopbarOficial from './Navegacion/TopbarOficial';
import StatCardPersonal from './MainDashboardOficial/StatCardPersonal';
import GraficoProgresion from './MainDashboardOficial/GraficoProgresion';
import ProximosHitos from './MainDashboardOficial/ProximosHitos';
import ListaMisTareas from './MainDashboardOficial/ListaMisTareas';
import { oficialService } from '../../services/oficialService';

const SeccionPrincipalOficial = ({ activeView, collapsed }) => {
  const [tareas, setTareas] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [hitos, setHitos] = useState([]);
  const oficialId = 2; // Hardcodeado a Brandon por ahora

  const fetchData = async () => {
    const data = await oficialService.getFullDashboardData(oficialId);
    if (data) {
      setTareas(data.lineas);
      setEstadisticas(data.estadisticas);
      setHitos(data.hitos);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="ContenidoVistasOficial">
      <TopbarOficial 
        seccion={activeView === 'dashboard' ? 'Dashboard Oficial' : activeView === 'lineas' ? 'Mis Líneas' : 'Historial'} 
        subtitulo="Programa Sembremos Seguridad · Cantón Puntarenas (Periodo 2025)"
        usuario={{ nombre: "Brandon Mora", zona: "Barranca" }}
      />

      {activeView === 'dashboard' && (
        <>
          <section className="GrillaEstadisticas">
            <StatCardPersonal 
              label="Mis Líneas" 
              valor={estadisticas?.misLineas?.toString().padStart(2, '0') || '00'} 
              tipo="info" 
            />
            <StatCardPersonal 
              label="Reportes Listos" 
              valor={estadisticas?.reportesListos?.toString().padStart(2, '0') || '00'} 
              tipo="exito" 
            />
            <StatCardPersonal 
              label="Por Reportar" 
              valor={estadisticas?.porReportar?.toString().padStart(2, '0') || '00'} 
              tipo="alerta" 
            />
          </section>

          <div className="GrillaPrincipalDosColumnas">
            <div className="ColumnaOperativa">
              <GraficoProgresion porcentaje={estadisticas?.progresoGeneral || 0} />
            </div>
            <div className="ColumnaInformativa">
              {hitos.length > 0 ? (
                <ProximosHitos hito={hitos[0].titulo} fecha={hitos[0].fecha} />
              ) : (
                <ProximosHitos hito="Sin hitos próximos" fecha="---" />
              )}
            </div>
          </div>

          <ListaMisTareas tareas={tareas} onUpdate={fetchData} />
        </>
      )}

      {activeView !== 'dashboard' && (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
          <h2>Sección {activeView} en desarrollo</h2>
          <p>Pronto podrás gestionar tus {activeView} aquí.</p>
        </div>
      )}
    </div>
  );
};

export default SeccionPrincipalOficial;
