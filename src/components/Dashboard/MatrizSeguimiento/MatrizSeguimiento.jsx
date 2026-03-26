import React, { useState, useEffect } from 'react';
import './MatrizSeguimiento.css';
import { useToast } from '../../../context/ToastContext';
import { dashboardService } from '../../../services/dashboardService';
import { useLogin } from '../../../context/LoginContext';
import { Save, Edit2, Search, Filter, Download, Plus } from 'lucide-react';
import { exportToCSV } from '../../../utils/exportUtils';

const MatrizSeguimiento = () => {
  const { user } = useLogin();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Para la edición en línea de la "Evidencia / Seguimiento"
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const dashData = await dashboardService.getFullDashboardData();
      if (dashData && dashData.lineas) {
        setData(dashData.lineas);
      }
    } catch (error) {
      showToast('Error al cargar la matriz', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = () => {
    if (!data || !data.length) return;

    // Aplanamos la data para que cada tarea sea una fila
    const flattenedData = [];
    data.forEach(linea => {
      linea.tareas.forEach((tarea, index) => {
        flattenedData.push({
          no: index === 0 ? linea.no : '', // Solo mostramos el no de linea en la primera tarea
          problematica: index === 0 ? linea.problematica : '', 
          lineaAccion: index === 0 ? linea.titulo : '',
          tareaId: tarea.id,
          tareaTitulo: tarea.titulo,
          indicador: tarea.indicador,
          meta: tarea.meta,
          plazo: tarea.plazo,
          responsable: tarea.institucionNombre,
          corresponsable: tarea.corresponsable,
          evidencia: tarea.evidenciaSeguimiento || '—'
        });
      });
    });

    const columns = [
      { label: 'No.', key: 'no' },
      { label: 'Problemática', key: 'problematica' },
      { label: 'Línea de Acción', key: 'lineaAccion' },
      { label: 'ID Tarea', key: 'tareaId' },
      { label: 'Acción Estratégica', key: 'tareaTitulo' },
      { label: 'Indicador', key: 'indicador' },
      { label: 'Meta', key: 'meta' },
      { label: 'Plazo', key: 'plazo' },
      { label: 'Institución Responsable', key: 'responsable' },
      { label: 'Corresponsable', key: 'corresponsable' },
      { label: 'Evidencia de Seguimiento', key: 'evidencia' }
    ];

    exportToCSV(flattenedData, `Matriz_Seguimiento_SembremosSeguridad_${new Date().toLocaleDateString()}`, columns);
    showToast('Exportando matriz a CSV/Excel...', 'success');
  };

  const handleEditClick = (tarea) => {
    setEditingId(tarea.id);
    setEditValue(tarea.evidenciaSeguimiento || '');
  };

  const handleSaveEdit = async (tarea) => {
    try {
      showToast('Guardando seguimiento...', 'info');
      setData(prev => prev.map(linea => {
        if (linea.id === tarea.lineaAccionId) {
          return {
            ...linea,
            tareas: linea.tareas.map(t => t.id === tarea.id ? { ...t, evidenciaSeguimiento: editValue } : t)
          };
        }
        return linea;
      }));
      setEditingId(null);
      showToast('Seguimiento actualizado correctamente', 'success');
    } catch (e) {
      showToast('Error al guardar', 'error');
    }
  };

  const filteredData = data.filter(linea => {
    const textSearch = `${linea.canton} ${linea.problematica} ${linea.titulo}`.toLowerCase();
    const lineMatches = textSearch.includes(searchTerm.toLowerCase());
    const hasMatchingTask = linea.tareas.some(t => 
      `${t.titulo} ${t.institucionNombre} ${t.indicador} ${t.consideraciones}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return lineMatches || hasMatchingTask;
  });

  if (loading) return <div className="matriz-loading">Cargando datos de matriz estratégica...</div>;

  return (
    <div className="matriz-seguimiento-v2">
      <header className="matriz-v2-header">
        <div className="header-titles">
          <h1>Matriz Plan Operativo Institucional - Sembremos Seguridad</h1>
          <p>Módulo de Control y Seguimiento Estratégico Multidisciplinario</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={handleExportExcel}>
            <Download size={16} /> Exportar Excel
          </button>
          {user?.rol !== 'auditor' && (
            <button className="btn-primary" onClick={() => showToast('Módulo en desarrollo', 'info')}>
              <Plus size={16} /> Nueva Línea Estratégica
            </button>
          )}
        </div>
      </header>

      <div className="matriz-v2-toolbar">
        <div className="search-box">
          <Search size={18} color="#64748b" />
          <input 
            type="text" 
            placeholder="Buscar por problemática, institución, indicador..." 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
          />
        </div>
        <div className="filter-box">
          <Filter size={18} color="#64748b" />
          <select defaultValue="Todos">
            <option value="Todos">Cantón: Todos</option>
            <option value="Puntarenas">Puntarenas</option>
          </select>
          <select defaultValue="Todos">
            <option value="Todos">Plazo: Todos</option>
            <option value="Anual">Anual</option>
            <option value="Bimestral">Bimestral</option>
            <option value="Cuatrimestral">Cuatrimestral</option>
          </select>
        </div>
      </div>

      <div className="excel-table-container">
        <table className="excel-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Problemática</th>
              <th>Línea de Acción</th>
              <th>Indicador / Meta</th>
              <th>Responsables</th>
              <th className="evidencia-col">Avance Cualitativo / Evidencia de Seguimiento</th>
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
                    <span className={`status-badge status--${(item.estado || 'Pendiente').toLowerCase().replace(' ', '-')}`}>{item.estado || 'Pendiente'}</span>
                    <div className="progress-mini-bar" style={{ marginTop: '8px' }}>
                      <div className="progress-mini-fill" style={{ width: `${item.progreso}%`, backgroundColor: item.progreso === 100 ? '#22c55e' : '#3b82f6' }} />
                      <span className="progress-mini-text">{item.tareasCompletadas}/{item.totalTareas}</span>
                    </div>
                  </td>
                </tr>

                {/* FILAS DE LAS TAREAS (ACCIONES ESTRATÉGICAS) */}
                {item.tareas.length === 0 ? (
                  <tr><td colSpan="8" className="empty-subrow">Sin acciones estratégicas registradas.</td></tr>
                ) : item.tareas.map(tarea => {
                  const isEditing = editingId === tarea.id;
                  return (
                    <tr key={tarea.id} className="data-row">
                      <td className="cell-id">
                        <span className="id-tag">{tarea.id}</span>
                      </td>
                      <td className="cell-accion">
                        <div className="text-wrap">{tarea.titulo}</div>
                      </td>
                      <td className="cell-indicador">
                        <div className="text-wrap">{tarea.indicador}</div>
                      </td>
                      <td className="cell-consideraciones">
                        <div className="text-wrap">
                          {tarea.consideraciones ? tarea.consideraciones.split('\n').map((line, idx) => (
                            <React.Fragment key={idx}>{line}<br/></React.Fragment>
                          )) : '—'}
                        </div>
                      </td>
                      <td className="cell-meta"><strong>{tarea.meta || '—'}</strong></td>
                      <td className="cell-plazo">
                        <span className="badge-plazo">{tarea.plazo || 'N/A'}</span>
                      </td>
                      <td className="cell-responsables">
                        <div className="resp-lider"><strong>Líder:</strong> {tarea.institucionNombre}</div>
                        {tarea.corresponsable && tarea.corresponsable !== '-' && (
                          <div className="resp-co"><strong>Co-gestor:</strong> {tarea.corresponsable}</div>
                        )}
                      </td>
                      <td className="cell-evidencia" onClick={() => !isEditing && user?.rol !== 'auditor' && handleEditClick(tarea)}>
                        {isEditing ? (
                          <div className="edit-mode">
                            <textarea 
                              autoFocus
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              rows="4"
                            />
                            <div className="edit-actions">
                              <button className="btn-cancel" onClick={(e) => { e.stopPropagation(); setEditingId(null); }}>Cancelar</button>
                              <button className="btn-save" onClick={(e) => { e.stopPropagation(); handleSaveEdit(tarea); }}><Save size={14} /> Guardar</button>
                            </div>
                          </div>
                        ) : (
                          <div className="view-mode">
                            <span className={tarea.evidenciaSeguimiento ? "evidencia-text" : "evidencia-empty"}>
                              {tarea.evidenciaSeguimiento || (user?.rol !== 'auditor' ? 'Click para agregar avance / observaciones de seguimiento...' : 'Sin evidencia de seguimiento')}
                            </span>
                            {user?.rol !== 'auditor' && <Edit2 size={13} className="edit-icon" />}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MatrizSeguimiento;
