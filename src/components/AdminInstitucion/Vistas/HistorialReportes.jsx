import React, { useState, useEffect } from 'react';
import { adminInstitucionService } from '../../../services/adminInstitucionService';
import { useToast } from '../../../context/ToastContext';
import { useLogin } from '../../../context/LoginContext';
import { 
  Clock, Users, Activity, CheckCircle, XCircle, AlertCircle, 
  Image as ImageIcon, Search, Calendar, Filter, ChevronRight,
  MapPin, MessageSquare, DollarSign, Building
} from 'lucide-react';
import '../AdminInstitucion.css';

const HistorialReportes = ({ isGlobal = false }) => {
  const { user } = useLogin();
  const { showToast } = useToast();
  
  const [reportes, setReportes] = useState([]);
  const [instituciones, setInstituciones] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filtros, setFiltros] = useState({
    busqueda: '',
    rango: 'Todos',
    estado: 'Todos',
    institucionId: isGlobal ? 'Todos' : (user?.id || ''),
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const queryParams = { ...filtros, isGlobal };
      if (queryParams.institucionId === 'Todos') delete queryParams.institucionId;
      
      const historial = await adminInstitucionService.getHistorial(queryParams);
      setReportes(historial);

      if (isGlobal && instituciones.length === 0) {
        // Cargar lista de instituciones para el filtro global
        const res = await fetch('http://localhost:5000/usuarios?rol=institucion&rol=adminInstitucion');
        const users = await res.json();
        setInstituciones(users);
      }
    } catch (e) {
      showToast('Error al cargar historial', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Carga inmediata al montar o al cambiar filtros que no sean búsqueda
    loadData();
  }, [filtros.rango, filtros.estado, filtros.institucionId, user?.id]);

  useEffect(() => {
    // Solo debouncing para la búsqueda de texto
    if (!filtros.busqueda) return;
    
    const delayDebounceFn = setTimeout(() => {
      loadData();
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [filtros.busqueda]);

  const getEstadoColor = (estado) => {
    if (estado === 'aprobado') return '#22c55e';
    if (estado === 'rechazado') return '#ef4444';
    return '#f59e0b';
  };

  return (
    <div className="historial-container">
      {/* ── HEADER & FILTROS ── */}
      <div className="historial-header-section">
        <div className="header-text">
          <h1>{isGlobal ? 'Bitácora Estratégica Cantonal' : 'Bitácora Institucional'}</h1>
          <p>{isGlobal ? 'Seguimiento consolidado de todos los actores del cantón' : 'Línea de tiempo de actualizaciones y registros oficiales'}</p>
        </div>

        <div className="timeline-filters-bar">
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Buscar por tarea, descripción o línea..." 
              value={filtros.busqueda}
              onChange={(e) => setFiltros({...filtros, busqueda: e.target.value})}
            />
          </div>

          <div className="filters-group">
            {isGlobal && (
              <div className="filter-select-wrapper">
                <Building size={16} />
                <select value={filtros.institucionId} onChange={(e) => setFiltros({...filtros, institucionId: e.target.value})}>
                  <option value="Todos">Todas las instituciones</option>
                  {instituciones.map(inst => (
                    <option key={inst.id} value={inst.id}>{inst.institucion || inst.nombre}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="filter-select-wrapper">
              <Calendar size={16} />
              <select value={filtros.rango} onChange={(e) => setFiltros({...filtros, rango: e.target.value})}>
                <option value="Todos">Todo el tiempo</option>
                <option value="Hoy">Hoy</option>
                <option value="Semana">Esta Semana</option>
              </select>
            </div>

            <div className="filter-select-wrapper">
              <Filter size={16} />
              <select value={filtros.estado} onChange={(e) => setFiltros({...filtros, estado: e.target.value})}>
                <option value="Todos">Todos los estados</option>
                <option value="pendiente">Pendientes</option>
                <option value="aprobado">Aprobados</option>
                <option value="rechazado">Rechazados</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ── TIMELINE ── */}
      <div className="timeline-wrapper">
        {loading ? (
          <div className="timeline-loading">Cargando bitácora...</div>
        ) : reportes.length === 0 ? (
          <div className="timeline-empty">
            <Clock size={48} />
            <h3>No se encontraron registros</h3>
            <p>Intentá con otros filtros o términos de búsqueda</p>
          </div>
        ) : (
          <div className="timeline-main">
            <div className="timeline-line"></div>
            
            {reportes.map((reporte, index) => (
              <div key={reporte.id} className="timeline-item" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="timeline-dot" style={{ backgroundColor: getEstadoColor(reporte.estado) }}>
                  {reporte.estado === 'aprobado' ? <CheckCircle size={14} /> : 
                   reporte.estado === 'rechazado' ? <XCircle size={14} /> : <Clock size={14} />}
                </div>
                
                <div className="timeline-date">
                  <span className="date-day">{new Date(reporte.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}</span>
                  <span className="date-year">{new Date(reporte.fecha).getFullYear()}</span>
                </div>

                <div className="timeline-card">
                  <div className="card-top-meta">
                    <span className="meta-linea">
                      <Activity size={12} /> L#{reporte.tarea?.lineaNumero || '?'}
                    </span>
                    <span className="meta-responsable">
                      <Users size={12} /> {reporte.responsable?.institucion || reporte.responsable?.nombre || 'Admin'}
                    </span>
                    <div className={`status-tag status--${reporte.estado}`}>
                      {reporte.estado}
                    </div>
                  </div>

                  <div className="card-content">
                    <h3 className="tarea-titulo">{reporte.tarea?.titulo}</h3>
                    <p className="reporte-desc">{reporte.descripcion}</p>
                    
                    <div className="metrics-summary">
                      <div className="metric-pill pill--place">
                        <MapPin size={12} /> <span>{reporte.tarea?.zona || reporte.lugar || 'Ubicación no especificada'}</span>
                      </div>
                      <div className="metric-pill pill--dept">
                        <Building size={12} /> <span>{reporte.responsable?.institucion || 'Sede Central'}</span>
                      </div>
                      <div className="metric-pill pill--people">
                        <Users size={12} /> <span>{reporte.beneficiados || 0} personas</span>
                      </div>
                      {reporte.inversionColones > 0 && (
                        <div className="metric-pill pill--money">
                          <DollarSign size={12} /> <span>₡{Number(reporte.inversionColones).toLocaleString()}</span>
                        </div>
                      )}
                      {reporte.tipoActividad && (
                        <div className="metric-pill pill--type">
                          <Activity size={12} /> <span>{reporte.tipoActividad}</span>
                        </div>
                      )}
                    </div>

                    {reporte.fotos && reporte.fotos.length > 0 && (
                      <div className="evidence-preview">
                        <span className="evidence-label"><ImageIcon size={12} /> Evidencias ({reporte.fotos.length})</span>
                        <div className="fotos-mini-grid">
                          {reporte.fotos.slice(0, 3).map((foto, i) => (
                            <div key={i} className="foto-mini-item">
                               <ImageIcon size={20} color="#cbd5e1" />
                            </div>
                          ))}
                          {reporte.fotos.length > 3 && <div className="foto-mini-more">+{reporte.fotos.length - 3}</div>}
                        </div>
                      </div>
                    )}

                    {reporte.estado === 'rechazado' && reporte.observacionRechazo && (
                      <div className="rejection-note">
                        <AlertCircle size={14} />
                        <div>
                          <strong>Motivo de rechazo:</strong> {reporte.observacionRechazo}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="card-footer">
                    <button className="btn-ver-detalle">
                      Ver Reporte Completo <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <style>{`
        .historial-container {
          padding: 2rem 2.5rem;
          color: #fff;
        }
        .historial-header-section {
          margin-bottom: 2.5rem;
        }
        .header-text h1 {
          font-size: 1.8rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        .header-text p {
          color: rgba(255,255,255,0.7);
          font-size: 0.95rem;
        }
        
        .timeline-filters-bar {
          display: flex;
          gap: 1.5rem;
          margin-top: 1.5rem;
          flex-wrap: wrap;
        }
        
        .search-wrapper {
          flex: 1;
          min-width: 250px;
          position: relative;
        }
        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }
        .search-wrapper input {
          width: 100%;
          padding: 12px 12px 12px 40px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          color: #fff;
          font-family: inherit;
          transition: all 0.3s;
        }
        .search-wrapper input:focus {
          outline: none;
          background: rgba(255,255,255,0.1);
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59,130,246,0.15);
        }
        
        .filters-group {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .filter-select-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.05);
          padding: 0 12px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.1);
          color: #94a3b8;
        }
        .filter-select-wrapper select {
          background: transparent;
          border: none;
          color: #fff;
          padding: 12px 4px;
          font-family: inherit;
          font-size: 0.85rem;
          cursor: pointer;
          max-width: 180px;
        }
        .filter-select-wrapper select:focus { outline: none; }
        .filter-select-wrapper select option { background: #0b2240; color: #fff; }

        .timeline-wrapper { position: relative; padding-left: 20px; }
        .timeline-main { position: relative; display: flex; flex-direction: column; gap: 2.5rem; }
        .timeline-line {
          position: absolute;
          left: 100px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(to bottom, #3b82f6, rgba(59,130,246,0.1));
          z-index: 1;
        }
        
        .timeline-item {
          display: flex;
          gap: 3.5rem;
          position: relative;
          animation: slideInUp 0.5s ease backwards;
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .timeline-dot {
          position: absolute;
          left: 100px;
          transform: translateX(-50%);
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          z-index: 3;
          box-shadow: 0 0 15px rgba(0,0,0,0.2);
          margin-top: 4px;
        }
        
        .timeline-date {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          min-width: 80px;
          padding-top: 8px;
          z-index: 2;
        }
        .date-day { font-weight: 800; font-size: 0.9rem; color: #fff; }
        .date-year { font-size: 0.7rem; color: #94a3b8; font-weight: 600; }
        
        .timeline-card {
          flex: 1;
          background: #fff;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          color: #1e293b;
          border: 1px solid #e2e8f0;
          transition: transform 0.3s;
        }
        .timeline-card:hover { transform: translateX(8px); }
        
        .card-top-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 1rem;
          font-size: 0.72rem;
          font-weight: 700;
        }
        .meta-linea { color: #3b82f6; background: #eff6ff; padding: 2px 8px; border-radius: 6px; display: flex; align-items: center; gap: 4px; }
        .meta-responsable { color: #64748b; display: flex; align-items: center; gap: 4px; }
        
        .status-tag { margin-left: auto; text-transform: uppercase; padding: 2px 8px; border-radius: 6px; }
        .status--aprobado { background: #dcfce7; color: #166534; }
        .status--rechazado { background: #fee2e2; color: #991b1b; }
        .status--pendiente { background: #fef3c7; color: #92400e; }
        
        .tarea-titulo { font-size: 1.1rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem; line-height: 1.3; }
        .reporte-desc { font-size: 0.88rem; color: #475569; line-height: 1.6; margin-bottom: 1.25rem; }
        
        .metrics-summary { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 1.25rem; }
        .metric-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          background: #f1f5f9;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #475569;
        }
        .pill--money { background: #f0fdf4; color: #166534; border: 1px solid #dcfce7; }
        .pill--type { background: #f5f3ff; color: #5b21b6; border: 1px solid #ddd6fe; }
        .pill--place { background: #fff7ed; color: #9a3412; border: 1px solid #ffedd5; }
        .pill--dept { background: #eff6ff; color: #1e40af; border: 1px solid #dbeafe; }
        .pill--people { background: #f0f9ff; color: #0369a1; border: 1px solid #e0f2fe; }
        
        .evidence-preview {
          background: #f8fafc;
          padding: 12px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          margin-bottom: 1.25rem;
        }
        .evidence-label { display: block; font-size: 0.7rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px; }
        .fotos-mini-grid { display: flex; gap: 8px; }
        .foto-mini-item {
          width: 48px;
          height: 48px;
          background: #e2e8f0;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .foto-mini-more {
          width: 48px;
          height: 48px;
          background: #334155;
          color: #fff;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
        }
        
        .rejection-note {
          display: flex;
          gap: 10px;
          background: #fff1f2;
          border: 1px solid #fecaca;
          padding: 12px;
          border-radius: 10px;
          color: #991b1b;
          font-size: 0.8rem;
          margin-bottom: 1.25rem;
        }
        
        .card-footer { border-top: 1px solid #f1f5f9; padding-top: 1rem; display: flex; justify-content: flex-end; }
        .btn-ver-detalle {
          background: none; border: none; color: #3b82f6; font-weight: 700; font-size: 0.8rem;
          display: flex; align-items: center; gap: 4px; cursor: pointer;
        }
        
        @media (max-width: 768px) {
          .timeline-item { flex-direction: column; gap: 0.5rem; padding-left: 10px; }
          .timeline-date { align-items: flex-start; }
          .timeline-dot { left: -15px; }
          .timeline-line { left: -5px; }
          .historial-container { padding: 1.5rem; }
        }
      `}</style>
    </div>
  );
};

export default HistorialReportes;
