import React, { useState, useEffect } from 'react';
import { Activity, Users, Building2, CheckCircle, AlertTriangle, BarChart3 } from 'lucide-react';
import { dashboardService } from '../../../services/dashboardService';
import SkeletonLoader from '../../Shared/SkeletonLoader';
import PageTransition from '../../Shared/PageTransition';
import './MesaCIR.css';

/**
 * Mesa CIR Social — Coordinación Interinstitucional
 * 
 * Visualiza el estado de articulación entre instituciones corresponsables
 * en cada línea de acción del programa Sembremos Seguridad.
 * 
 * Muestra qué instituciones están activas (tienen tareas con actividad)
 * vs. inactivas (sin tareas o sin reportes) para cada línea estratégica.
 */
const MesaCIR = () => {
  const [lineas, setLineas] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dashboardService.getFullDashboardData();
        setLineas(data.lineas || []);
        setTareas(data.tareas || []);
      } catch (error) {
        console.error('Error loading CIR data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <PageTransition><SkeletonLoader type="table" /></PageTransition>;
  }

  // Calcular datos de articulación por línea
  const articulacionData = lineas.map(linea => {
    const corresponsables = linea.corresponsables || linea.responsables || [];
    const tareasLinea = tareas.filter(t => t.lineaAccionId === linea.id);
    
    // Instituciones que SÍ tienen tareas asignadas en esta línea
    const instConTareas = [...new Set(tareasLinea.map(t => t.institucionNombre).filter(Boolean))];
    
    // Instituciones con actividad (estado != Pendiente)
    const instActivas = [...new Set(
      tareasLinea
        .filter(t => t.estado !== 'Pendiente')
        .map(t => t.institucionNombre)
        .filter(Boolean)
    )];

    const totalCorr = Array.isArray(corresponsables) ? corresponsables.length : 0;
    const totalActivas = instActivas.length;
    const pctArticulacion = totalCorr > 0 ? Math.round((totalActivas / totalCorr) * 100) : 0;

    return {
      id: linea.id,
      no: linea.no,
      titulo: linea.titulo,
      problematica: linea.problematica,
      corresponsables: Array.isArray(corresponsables) ? corresponsables : [],
      instConTareas,
      instActivas,
      totalTareas: tareasLinea.length,
      tareasConActividad: tareasLinea.filter(t => t.estado === 'Con Actividades' || t.estado === 'En Proceso').length,
      pctArticulacion
    };
  }).filter(l => l.corresponsables.length > 0); // Solo líneas con corresponsables

  // Stats globales
  const totalInstituciones = [...new Set(articulacionData.flatMap(l => l.corresponsables))].length;
  const totalActivas = [...new Set(articulacionData.flatMap(l => l.instActivas))].length;
  const totalInactivas = totalInstituciones - totalActivas;
  const avgArticulacion = articulacionData.length > 0
    ? Math.round(articulacionData.reduce((acc, l) => acc + l.pctArticulacion, 0) / articulacionData.length)
    : 0;

  return (
    <PageTransition>
      <div className="mesa-cir-container">
        {/* Banner */}
        <div className="mesa-cir-banner">
          <span className="mesa-cir-badge">COMITÉ INTERSECTORIAL REGIONAL SOCIAL</span>
          <h1>Mesa CIR Social — Coordinación Interinstitucional</h1>
          <p>
            Articulación de esfuerzos entre instituciones corresponsables para atender 
            poblaciones vulnerables, consumo de drogas y recuperación de espacios públicos.
          </p>
        </div>

        {/* Stats */}
        <div className="mesa-cir-stats">
          <div className="mesa-cir-stat-card">
            <div className="stat-icon-box blue"><Building2 size={18} /></div>
            <div className="stat-data">
              <span className="stat-val">{totalInstituciones}</span>
              <span className="stat-lbl">Instituciones Involucradas</span>
            </div>
          </div>
          <div className="mesa-cir-stat-card">
            <div className="stat-icon-box green"><CheckCircle size={18} /></div>
            <div className="stat-data">
              <span className="stat-val">{totalActivas}</span>
              <span className="stat-lbl">Con Actividad Registrada</span>
            </div>
          </div>
          <div className="mesa-cir-stat-card">
            <div className="stat-icon-box red"><AlertTriangle size={18} /></div>
            <div className="stat-data">
              <span className="stat-val">{totalInactivas}</span>
              <span className="stat-lbl">Sin Actividad</span>
            </div>
          </div>
          <div className="mesa-cir-stat-card">
            <div className="stat-icon-box amber"><BarChart3 size={18} /></div>
            <div className="stat-data">
              <span className="stat-val">{avgArticulacion}%</span>
              <span className="stat-lbl">Articulación Promedio</span>
            </div>
          </div>
        </div>

        {/* Tabla de Coordinación */}
        <div className="mesa-cir-table-card">
          <div className="mesa-cir-table-header">
            <Activity size={18} />
            Estado de Articulación por Línea de Acción
          </div>
          <table className="mesa-cir-table">
            <thead>
              <tr>
                <th style={{width:'40px'}}>No.</th>
                <th>Línea de Acción</th>
                <th>Problemática</th>
                <th>Instituciones Corresponsables</th>
                <th style={{width:'100px'}}>Tareas</th>
                <th style={{width:'130px'}}>Articulación</th>
              </tr>
            </thead>
            <tbody>
              {articulacionData.map(linea => (
                <tr key={linea.id}>
                  <td style={{fontWeight:800, color:'#0f172a'}}>{linea.no}</td>
                  <td style={{fontWeight:600}}>{linea.titulo}</td>
                  <td>{linea.problematica}</td>
                  <td>
                    {linea.corresponsables.map((inst, i) => {
                      const isActive = linea.instActivas.some(a => 
                        a.toLowerCase().includes(inst.toLowerCase()) || 
                        inst.toLowerCase().includes(a.toLowerCase())
                      );
                      const hasTareas = linea.instConTareas.some(a => 
                        a.toLowerCase().includes(inst.toLowerCase()) || 
                        inst.toLowerCase().includes(a.toLowerCase())
                      );
                      return (
                        <span 
                          key={i} 
                          className={`inst-pill ${isActive ? 'active' : hasTareas ? '' : 'inactive'}`}
                          title={isActive ? 'Con actividad' : hasTareas ? 'Tareas asignadas' : 'Sin tareas registradas'}
                        >
                          {inst}
                        </span>
                      );
                    })}
                  </td>
                  <td>
                    <span style={{fontWeight:700}}>{linea.tareasConActividad}</span>
                    <span style={{color:'#94a3b8'}}> / {linea.totalTareas}</span>
                  </td>
                  <td>
                    <div className="status-bar-mini">
                      <div className="status-bar-track">
                        <div 
                          className="status-bar-fill" 
                          style={{
                            width: `${linea.pctArticulacion}%`,
                            background: linea.pctArticulacion >= 60 ? '#22c55e' : linea.pctArticulacion >= 30 ? '#f59e0b' : '#ef4444'
                          }}
                        />
                      </div>
                      <span className="status-pct">{linea.pctArticulacion}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageTransition>
  );
};

export default MesaCIR;
