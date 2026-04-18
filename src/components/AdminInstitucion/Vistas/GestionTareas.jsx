import React, { useState, useEffect } from 'react';
import { adminInstitucionService } from '../../../services/adminInstitucionService';
import { useToast } from '../../../context/ToastContext';
import { useLogin } from '../../../context/LoginContext';
import { Activity, Users, Target, MapPin, Calendar, CheckSquare, Search, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import '../AdminInstitucion.css';

// No hardcoded LINEAS_ACCION_INFO here anymore

const GestionTareas = () => {
  const { user } = useLogin();
  const [tareas, setTareas] = useState([]);
  const [responsables, setResponsables] = useState([]);
  const [lineasAccion, setLineasAccion] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filtros, setFiltros] = useState({
    busqueda: '',
    estado: 'Todos',
    lineaId: 'Todos',
    trimestre: 'Todos',
    mes: 'Todos',
    lugar: 'Todos',
    oficial: 'Todos'
  });
  const [tareasRaw, setTareasRaw] = useState([]);

  const [modalAsignacion, setModalAsignacion] = useState({
    show: false, tareaId: null, currentResponsables: []
  });

  const [lineasExpandidas, setLineasExpandidas] = useState({});
  const { showToast } = useToast();

  const getMesNombre = (fechaString) => {
    if (!fechaString) return '';
    const partes = fechaString.split('-');
    if (partes.length < 2) return '';
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const mesIndex = parseInt(partes[1], 10) - 1;
    return meses[mesIndex] || '';
  };

  const handleFiltro = (key, value) => {
    setFiltros(prev => ({ ...prev, [key]: value }));
  };

  const loadData = async () => {
    try {
      const [tareasData, responsablesData, lineasData] = await Promise.all([
        adminInstitucionService.getTareas({ institucionId: user?.id }),
        adminInstitucionService.getResponsables(),
      ]);
      setTareasRaw(tareasData.filter(t => t.estado !== 'Completado'));
      setResponsables(responsablesData);
      setLineasAccion(lineasData);
    } catch (e) {
      showToast('Error al cargar tareas', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (user) loadData(); 
  }, [user]);

  useEffect(() => {
    let filtradas = [...tareasRaw];

    if (filtros.trimestre !== 'Todos') {
      filtradas = filtradas.filter(t => t.trimestre === filtros.trimestre);
    }
    if (filtros.mes !== 'Todos') {
      filtradas = filtradas.filter(t => getMesNombre(t.fechaLimite) === filtros.mes);
    }
    if (filtros.lugar !== 'Todos') {
      filtradas = filtradas.filter(t => t.zona === filtros.lugar);
    }
    if (filtros.oficial !== 'Todos') {
      filtradas = filtradas.filter(t => (t.responsableIds || []).includes(filtros.oficial));
    }

    setTareas(filtradas);
  }, [tareasRaw, filtros]);

  const lugaresUnicos = [...new Set(tareasRaw.map(t => t.zona).filter(Boolean))].sort();
  const mesesUnicos = [...new Set(tareasRaw.map(t => getMesNombre(t.fechaLimite)).filter(Boolean))].sort((a,b) => {
    const m = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return m.indexOf(a) - m.indexOf(b);
  });

  const handleToggleResponsable = async (tareaId, responsableId, currentlySelected) => {
    try {
      const tarea = tareas.find(t => t.id === tareaId);
      if (!tarea) return;

      let newIds = [...(tarea.responsableIds || [])];
      if (currentlySelected) {
        newIds = newIds.filter(id => id !== responsableId);
      } else {
        newIds.push(responsableId);
      }

      const result = await adminInstitucionService.asignarResponsable(tareaId, newIds);
      if (result.success) {
        showToast('Responsables actualizados correctamente', 'success');
        loadData();
      }
    } catch (e) {
      showToast('Error al asignar responsable', 'error');
    }
  };

  const toggleLinea = (id) => {
    setLineasExpandidas(prev => ({...prev, [id]: !prev[id]}));
  };

  if (loading) return <div style={{ padding: '3rem', color: '#7a9cc4' }}>Cargando tareas...</div>;

  const getBadgeClass = (estado) => {
    if (estado === 'Con Actividades') return 'admin-inst-badge--con-actividades';
    return 'admin-inst-badge--sin-actividades';
  };

  return (
    <div style={{ padding: '2rem 2.5rem', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: '0 0 4px', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
          Gestión de Tareas
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', margin: 0, textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
          Visualiza las tareas asignadas a la institución y delega responsables.
        </p>
      </div>

      <div className="admin-inst-filters" style={{ marginBottom: '1.5rem', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <select className="admin-inst-select" value={filtros.trimestre} onChange={e => handleFiltro('trimestre', e.target.value)}>
          <option value="Todos">Todos los Trimestres</option>
          <option value="I Trimestre 2025">I Trimestre 2025</option>
          <option value="II Trimestre 2025">II Trimestre 2025</option>
          <option value="III Trimestre 2025">III Trimestre 2025</option>
          <option value="IV Trimestre 2025">IV Trimestre 2025</option>
        </select>

        <select className="admin-inst-select" value={filtros.mes} onChange={e => handleFiltro('mes', e.target.value)}>
          <option value="Todos">Todos los Meses</option>
          {mesesUnicos.map(mes => (
            <option key={mes} value={mes}>{mes}</option>
          ))}
        </select>

        <select className="admin-inst-select" value={filtros.lugar} onChange={e => handleFiltro('lugar', e.target.value)}>
          <option value="Todos">Todos los Lugares</option>
          {lugaresUnicos.map(lugar => (
            <option key={lugar} value={lugar}>{lugar}</option>
          ))}
        </select>

        <select className="admin-inst-select" value={filtros.oficial} onChange={e => handleFiltro('oficial', e.target.value)}>
          <option value="Todos">Todos los Oficiales</option>
          {responsables.map(r => (
            <option key={r.id} value={r.id}>{r.nombre}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {lineasAccion.map(linea => {
          const tareasLinea = tareas.filter(t => t.lineaAccionId === linea.id);
          if (tareasLinea.length === 0) return null; // Solo mostrar líneas que tienen tareas asignadas para esta institución
          const isExpanded = lineasExpandidas[linea.id];

          return (
            <div key={linea.id} className="admin-inst-stat-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div 
                style={{ 
                  padding: '1rem 1.25rem', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  cursor: 'pointer',
                  background: isExpanded ? '#f8fafc' : '#fff',
                  borderBottom: isExpanded ? '1px solid #e2e8f0' : 'none',
                  transition: 'background 0.2s'
                }}
                onClick={() => toggleLinea(linea.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ padding: '8px', background: '#e0e7ff', color: '#4f46e5', borderRadius: '8px' }}>
                    <Activity size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a', fontWeight: 700 }}>
                      Línea #{linea.no || linea.numero || linea.id} — {linea.titulo || linea.nombre}
                    </h3>
                    <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                      {tareasLinea.length} tareas pendientes de asignación o en progreso
                    </p>
                  </div>
                </div>
                <div style={{ color: '#94a3b8' }}>
                  {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </div>
              </div>

              {isExpanded && (
                <div style={{ padding: '1.25rem', background: '#fff' }}>
                  {tareasLinea.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                      <CheckSquare size={32} style={{ opacity: 0.5, marginBottom: '8px' }} />
                      <p style={{ margin: 0, fontSize: '0.9rem' }}>No hay tareas pendientes para esta línea.</p>
                    </div>
                  ) : (
                    tareasLinea.map(tarea => (
                      <div key={tarea.id} className="admin-inst-task-card" style={{ marginBottom: '1rem', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                        <div className="admin-inst-task-linea" style={{ background: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Target size={14} style={{ flexShrink: 0 }} />
                          <span style={{ fontSize: '0.78rem' }}>
                            <strong>Indicador a cumplir:</strong> {tarea.indicador} <span style={{opacity: 0.5}}>|</span> <strong>Meta departamental:</strong> {tarea.meta} <span style={{opacity: 0.5}}>|</span> {tarea.trimestre}
                          </span>
                        </div>

                        <div className="admin-inst-task-body">
                          <div className="admin-inst-task-info">
                            <h4 className="admin-inst-task-title">{tarea.titulo}</h4>
                            <p className="admin-inst-task-desc">{tarea.descripcion}</p>
                            <div className="admin-inst-task-meta">
                              <span className="admin-inst-meta-tag">
                                <MapPin size={12} /> {tarea.zona}
                              </span>
                              <span className="admin-inst-meta-tag">
                                <Calendar size={12} /> {tarea.fechaLimite}
                              </span>
                              <span className={`admin-inst-badge ${getBadgeClass(tarea.estado)}`}>
                                {tarea.estado}
                              </span>
                            </div>
                          </div>

                          <div className="admin-inst-task-actions" style={{ minWidth: '220px', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <span style={{ fontSize: '0.75rem', color: '#334155', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                              <Users size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                              ENCARGADOS
                            </span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '140px', overflowY: 'auto' }}>
                              {responsables.map(r => {
                                const isSelected = (tarea.responsableIds || []).includes(r.id);
                                return (
                                  <label key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer', color: isSelected ? '#0f172a' : '#475569' }}>
                                    <input 
                                      type="checkbox" 
                                      checked={isSelected} 
                                      onChange={() => handleToggleResponsable(tarea.id, r.id, isSelected)}
                                      style={{ cursor: 'pointer', accentColor: '#3b82f6', width: '14px', height: '14px' }}
                                    />
                                    {r.nombre}
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GestionTareas;
