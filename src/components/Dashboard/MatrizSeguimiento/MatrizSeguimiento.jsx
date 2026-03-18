import React, { useState, useEffect } from 'react';
import './MatrizSeguimiento.css';
import { useToast } from '../../../context/ToastContext';
import { dashboardService } from '../../../services/dashboardService';
import { DollarSign, ChevronDown, ChevronUp, CheckCircle, Clock } from 'lucide-react';

const Icon = {
  Search: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Filter: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  Download: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
};

const MatrizSeguimiento = () => {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);

  const formatColones = (amount) => {
    if (!amount || amount === 0) return '₡0';
    return '₡' + amount.toLocaleString('es-CR');
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const dashData = await dashboardService.getFullDashboardData();
        if (dashData && dashData.lineas) {
          const mapped = dashData.lineas.map(linea => {
            let estado = 'Pendiente';
            if (linea.totalTareas > 0 && linea.progreso === 100) estado = 'Completada';
            else if (linea.progreso > 0) estado = 'En ejecución';
            return { ...linea, estado };
          });
          setData(mapped);
        }
      } catch (error) {
        showToast('Error al cargar la matriz', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredData = data.filter(item => {
    const text = `${item.lineaAccion} ${item.id} ${item.problematica}`.toLowerCase();
    const matchesSearch = text.includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'Todos' || item.estado === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) return <div style={{ padding: '3rem', color: '#7a9cc4' }}>Cargando matriz...</div>;

  return (
    <div className="matriz-seguimiento">
      <header className="matriz-header">
        <div className="matriz-title-block">
          <h1>Matriz Estratégica Institucional</h1>
          <p>Líneas de Trabajo · Cantón Puntarenas</p>
        </div>
        <button className="btn-export" onClick={() => showToast('Generando reporte...', 'info')}>
          <Icon.Download /> Exportar
        </button>
      </header>

      <div className="matriz-controls">
        <div className="search-wrapper">
          <Icon.Search />
          <input type="text" placeholder="Buscar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div className="filter-wrapper">
          <Icon.Filter />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="Todos">Todos</option>
            <option value="Completada">Completadas</option>
            <option value="En ejecución">En ejecución</option>
            <option value="Pendiente">Pendientes</option>
          </select>
        </div>
      </div>

      <div className="matriz-table-container">
        <table className="matriz-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Problemática</th>
              <th>Línea de Acción</th>
              <th>Indicador / Meta</th>
              <th>Responsables</th>
              <th>Progreso</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(item => (
              <React.Fragment key={item.id}>
                <tr>
                  <td className="col-no"><small>#{item.no}</small></td>
                  <td className="col-prob">
                    <div className="status-dot-mini" style={{ background: item.progreso === 100 ? '#22c55e' : item.progreso > 0 ? '#3b82f6' : '#94a3b8' }} />
                    <strong>{item.problematica}</strong>
                    <div className="item-id-tag">{item.id}</div>
                  </td>
                  <td className="col-accion">
                    <div className="action-title-main">{item.lineaAccion}</div>
                  </td>
                  <td className="col-meta">
                    <div className="action-meta-main">{item.meta || '—'}</div>
                    <div className="action-indicador-sub">Ind: {item.indicador || '—'}</div>
                  </td>
                  <td className="col-resp">
                    <div className="resp-main">{item.responsable}</div>
                    <div className="resp-sub">{item.corresponsable}</div>
                  </td>
                  <td className="col-progreso-status">
                    <span className={`status-badge status--${item.estado.toLowerCase().replace(' ', '-')}`}>{item.estado}</span>
                    <div className="progress-mini-bar" style={{ marginTop: '8px' }}>
                      <div className="progress-mini-fill" style={{ width: `${item.progreso}%`, backgroundColor: item.progreso === 100 ? '#22c55e' : '#3b82f6' }} />
                      <span className="progress-mini-text">{item.tareasCompletadas}/{item.totalTareas}</span>
                    </div>
                    {item.inversionLinea > 0 && (
                      <div style={{ fontSize: '0.7rem', color: '#0b2240', fontWeight: 700, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <DollarSign size={11} /> {formatColones(item.inversionLinea)}
                      </div>
                    )}
                  </td>
                  <td className="col-actions">
                    <button className="btn-icon-more" onClick={() => setExpandedRow(expandedRow === item.id ? null : item.id)}>
                      {expandedRow === item.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </td>
                </tr>
                {expandedRow === item.id && (
                  <tr><td colSpan="7" style={{ padding: 0, background: '#f8fafc' }}>
                    <div style={{ padding: '16px 24px' }}>
                      <h5 style={{ margin: '0 0 12px', fontSize: '0.78rem', fontWeight: 700, color: '#0b2240', textTransform: 'uppercase' }}>Tareas — {item.id}</h5>
                      {item.tareas && item.tareas.length > 0 ? item.tareas.map(t => (
                        <div key={t.id} style={{ padding: '10px 14px', marginBottom: '6px', background: t.completada ? '#f0fdf4' : '#fff', borderRadius: '8px', border: `1px solid ${t.completada ? '#bbf7d0' : '#e2e8f0'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {t.completada ? <CheckCircle size={16} color="#22c55e" /> : <Clock size={16} color="#94a3b8" />}
                            <div>
                              <strong style={{ color: '#0b2240' }}>{t.titulo}</strong>
                              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{t.oficialNombre} {t.completada && `· ${t.fechaCompletada}`}</div>
                              {t.reporteOficial && <div style={{ fontSize: '0.75rem', color: '#334155', marginTop: '2px', fontStyle: 'italic' }}>"{t.reporteOficial}"</div>}
                              {t.fotos && t.fotos.length > 0 && (
                                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                                  {t.fotos.map((url, i) => (
                                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: '#3b82f6', textDecoration: 'none', background: '#eff6ff', padding: '2px 6px', borderRadius: '4px', border: '1px solid #bfdbfe' }}>
                                      📷 Foto {i+1}
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          {t.inversionColones > 0 && <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0b2240' }}>{formatColones(t.inversionColones)}</span>}
                        </div>
                      )) : <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Sin tareas asignadas.</p>}
                    </div>
                  </td></tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        {filteredData.length === 0 && <div className="empty-state"><p>No se encontraron resultados.</p></div>}
      </div>
    </div>
  );
};

export default MatrizSeguimiento;
