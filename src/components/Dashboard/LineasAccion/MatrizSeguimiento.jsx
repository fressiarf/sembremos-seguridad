import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../../services/dashboardService';
import './MatrizSeguimiento.css';

const MatrizSeguimiento = () => {
  const [lineas, setLineas] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dashboardService.getFullDashboardData();
        setLineas(data.lineasEnriquecidas || []);
        setTareas(data.tareas || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching matriz data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredLineas = lineas.filter(l => 
    l.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.problematica?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.objetivo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) return <div className="matriz-container">Cargando matriz estratégica...</div>;

  return (
    <div className="matriz-container">
      <div className="matriz-header">
        <h1>Matriz de Seguimiento Estratégico</h1>
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Buscar por línea, objetivo o problemática..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', width: '400px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
          />
        </div>
      </div>

      <div className="matriz-card">
        <div className="matriz-table-wrapper">
          <table className="matriz-table">
            <thead>
              <tr>
                <th className="col-no">No.</th>
                <th className="col-canton">Cantón</th>
                <th className="col-problematica">Factores Priorizados</th>
                <th className="col-titulo">Línea de Acción</th>
                <th className="col-objetivo">Objetivo</th>
                <th className="col-meta">Meta / Indicador</th>
                <th className="col-responsables">Responsables</th>
              </tr>
            </thead>
            <tbody>
              {filteredLineas.map((linea) => (
                <React.Fragment key={linea.id}>
                  <tr onClick={() => toggleExpand(linea.id)}>
                    <td className="col-no">{linea.no}</td>
                    <td className="col-canton">{linea.canton}</td>
                    <td className="col-problematica">{linea.problematica}</td>
                    <td className="col-titulo">
                      {linea.titulo}
                      <div className="tag-plazo">{linea.plazo || 'Anual'}</div>
                    </td>
                    <td className="col-objetivo">{linea.objetivo || 'Sin objetivo definido'}</td>
                    <td className="col-meta">
                      <div className="tag-meta">{linea.meta}</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>{linea.indicador}</div>
                    </td>
                    <td className="col-responsables">
                      <div className="responsables-list">
                        {Array.isArray(linea.responsables) ? (
                          linea.responsables.map((r, i) => (
                            <span key={i} className="mini-tag" style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem' }}>{r}</span>
                          ))
                        ) : (
                          <span className="mini-tag">{linea.institucionLider || 'Múltiples'}</span>
                        )}
                        {linea.corresponsables && (
                          <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '4px' }}>
                            <strong>Co-gestores:</strong> {linea.corresponsables.join(', ')}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                  
                  {expandedId === linea.id && (
                    <tr className="planificacion-row">
                      <td colSpan="7">
                        <div className="planificacion-content">
                          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1e3a8a', marginBottom: '1rem' }}>
                            PLANIFICACIÓN 2025: Detalle de Acciones Estratégicas
                          </h3>
                          <table className="planificacion-table">
                            <thead>
                              <tr>
                                <th>Acción Estratégica</th>
                                <th>Indicador</th>
                                <th>Consideraciones</th>
                                <th>Meta</th>
                                <th>Líder</th>
                                <th>Progreso</th>
                              </tr>
                            </thead>
                            <tbody>
                              {tareas.filter(t => t.lineaAccionId === linea.id).map(tarea => (
                                <tr key={tarea.id}>
                                  <td style={{ fontWeight: '600' }}>{tarea.titulo}</td>
                                  <td>{tarea.indicador}</td>
                                  <td style={{ whiteSpace: 'pre-line' }}>{tarea.consideraciones}</td>
                                  <td><span className="tag-meta">{tarea.meta}</span></td>
                                  <td>{tarea.institucionNombre}</td>
                                  <td style={{ textAlign: 'center' }}>
                                    <div style={{ width: '100%', background: '#e2e8f0', height: '8px', borderRadius: '4px', position: 'relative' }}>
                                      <div style={{ width: `${tarea.completada ? 100 : (tarea.metaValor ? (Math.random() * 50 + 20) : 0)}%`, background: '#3b82f6', height: '100%', borderRadius: '4px' }}></div>
                                    </div>
                                    <span style={{ fontSize: '0.65rem' }}>{tarea.completada ? 'Cerrada' : 'En ejecución'}</span>
                                  </td>
                                </tr>
                              ))}
                              {tareas.filter(t => t.lineaAccionId === linea.id).length === 0 && (
                                <tr>
                                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No hay acciones estratégicas registradas para esta línea.</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MatrizSeguimiento;
