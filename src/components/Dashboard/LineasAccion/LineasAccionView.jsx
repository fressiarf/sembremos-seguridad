import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../../services/dashboardService';
import { TrendingUp, ChevronDown, ChevronUp, Search, Filter, Info, Users, BarChart3 } from 'lucide-react';
import './LineasAccionView.css';

const LineasAccionView = () => {
  const [lineas, setLineas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLineas = async () => {
      try {
        const data = await dashboardService.getFullDashboardData();
        if (data && data.lineas) {
          setLineas(data.lineas);
        }
      } catch (error) {
        console.error("Error al cargar líneas de acción:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLineas();
  }, []);

  const filteredLineas = lineas.filter(l => 
    l.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.problematica.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="lineas-view-loading">
        <div className="spinner"></div>
        <p>Cargando todas las líneas de acción estratégicas...</p>
      </div>
    );
  }

  return (
    <div className="lineas-accion-view">
      <header className="lineas-view-header">
        <div className="header-text">
          <h1>Líneas de Acción Estratégicas</h1>
          <p>Gestión completa de metas y objetivos del Programa Sembremos Seguridad</p>
        </div>
        
        <div className="header-controls">
          <div className="search-box">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Buscar por título o problemática..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="stats-badge">
            <TrendingUp size={16} />
            <span>{lineas.length} Líneas Activas</span>
          </div>
        </div>
      </header>

      <div className="lineas-grid">
        {filteredLineas.length > 0 ? (
          filteredLineas.map((linea) => (
            <div key={linea.id} className={`linea-card ${expandedId === linea.id ? 'is-expanded' : ''}`}>
              <div className="linea-card-main" onClick={() => toggleExpand(linea.id)}>
                <div className="linea-card-info">
                  <div className="linea-number">#{linea.no || linea.id.split('-')[1]}</div>
                  <div className="linea-title-group">
                    <h3>{linea.titulo}</h3>
                    <div className="linea-tags">
                      <span className="tag-canton">{linea.canton}</span>
                      <span className="tag-tareas">{linea.totalTareas || 0} Tareas</span>
                    </div>
                  </div>
                </div>

                <div className="linea-card-progress">
                  <div className="progress-info">
                    <span className="progress-label">Progreso Real</span>
                    <span className="progress-val">{linea.progreso}%</span>
                  </div>
                  <div className="progress-track">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${linea.progreso}%`,
                        backgroundColor: linea.progreso > 70 ? '#10b981' : (linea.progreso > 30 ? '#3b82f6' : '#f59e0b')
                      }}
                    ></div>
                  </div>
                </div>

                <div className="expand-icon">
                  {expandedId === linea.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {expandedId === linea.id && (
                <div className="linea-card-details">
                  <div className="details-grid">
                    <div className="detail-section">
                      <h4><Info size={14} /> Problemática Detectada</h4>
                      <p>{linea.problematica}</p>
                    </div>
                    
                    <div className="detail-section">
                      <h4><Users size={14} /> Instituciones Responsables</h4>
                      <div className="responsables-tags">
                        {Array.isArray(linea.responsables) ? (
                          linea.responsables.map((r, i) => <span key={i} className="resp-tag">{r}</span>)
                        ) : (
                          <span className="resp-tag">{linea.institucionLider || 'Sin asignar'}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="tasks-summary">
                    <div className="summary-item">
                      <BarChart3 size={16} />
                      <span>{linea.tareasCompletadas || 0} Completadas</span>
                    </div>
                    <div className="summary-item">
                      <BarChart3 size={16} />
                      <span>{(linea.totalTareas || 0) - (linea.tareasCompletadas || 0)} Pendientes</span>
                    </div>
                    <div className="summary-item">
                      <BarChart3 size={16} />
                      <span>Inversión: ₡{linea.inversionLinea?.toLocaleString() || 0}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No se encontraron líneas de acción que coincidan con tu búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LineasAccionView;
