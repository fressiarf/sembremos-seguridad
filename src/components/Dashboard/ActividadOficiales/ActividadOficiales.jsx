import React, { useState, useEffect } from 'react';
import './ActividadOficiales.css';
import { useToast } from '../../../context/ToastContext';
import { dashboardService } from '../../../services/dashboardService';
import { userService } from '../../../services/userService';
import { Users, Edit, Plus, X, ListTodo, MapPin, DollarSign, CheckCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';

const ActividadOficiales = () => {
  const [officers, setOfficers] = useState([]);
  const [lineas, setLineas] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLineaForm, setShowLineaForm] = useState(false);
  const [showTareaForm, setShowTareaForm] = useState(false);
  const [expandedLinea, setExpandedLinea] = useState(null);
  const [stats, setStats] = useState({ totalTareas: 0, tareasCompletadas: 0, inversionTotal: 0 });
  const { showToast } = useToast();

  const [newLinea, setNewLinea] = useState({
    problematica: '', lineaAccion: '', objetivo: '',
    indicador: '', meta: '', responsable: 'Municipalidad',
    corresponsable: '', zona: 'Barranca'
  });

  const [newTarea, setNewTarea] = useState({
    lineaAccionId: '', titulo: '', descripcion: '', institucionId: ''
  });

  const formatColones = (amount) => {
    if (!amount || amount === 0) return '₡0';
    return '₡' + amount.toLocaleString('es-CR');
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const dashData = await dashboardService.getFullDashboardData();
      const allUsers = await userService.getUsers();
      const onlyOfficers = allUsers.filter(u => u.rol === 'institución');
      setOfficers(onlyOfficers);

      if (dashData) {
        setLineas(dashData.lineas);
        setTareas(dashData.tareas);
        setStats(dashData.stats);
      }
    } catch (error) {
      showToast('Error al cargar datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // ── Crear Línea de Acción ──
  const handleCreateLinea = async (e) => {
    e.preventDefault();
    if (!newLinea.problematica || !newLinea.lineaAccion) {
      showToast('Completa los campos obligatorios (*)', 'warning');
      return;
    }
    try {
      const lineaId = `LA-${Date.now().toString().slice(-4)}`;
      await dashboardService.createLineaAccion({ ...newLinea, id: lineaId, no: lineas.length + 1 });
      showToast('Línea de acción creada ✓', 'success');
      setShowLineaForm(false);
      setNewLinea({ problematica: '', lineaAccion: '', objetivo: '', indicador: '', meta: '', responsable: 'Municipalidad', corresponsable: '', zona: 'Barranca' });
      loadData();
    } catch (error) {
      showToast('Error al crear la línea', 'error');
    }
  };

  // ── Crear Tarea ──
  const handleCreateTarea = async (e) => {
    e.preventDefault();
    if (!newTarea.lineaAccionId || !newTarea.titulo || !newTarea.institucionId) {
      showToast('Seleccioná línea, título e institución (*)', 'warning');
      return;
    }
    try {
      const institucion = officers.find(o => o.id === newTarea.institucionId);
      await dashboardService.createTarea({
        ...newTarea,
        institucionNombre: institucion?.nombre || 'Sin nombre'
      });
      showToast('Tarea creada y asignada ✓', 'success');
      setShowTareaForm(false);
      setNewTarea({ lineaAccionId: '', titulo: '', descripcion: '', institucionId: '' });
      loadData();
    } catch (error) {
      showToast('Error al crear la tarea', 'error');
    }
  };

  if (loading) return <div style={{ padding: '3rem', color: '#7a9cc4' }}>Cargando...</div>;

  return (
    <div className="actividad-oficiales">
      <header className="actividad-oficiales__header">
        <div className="actividad-oficiales__title-block">
          <h1>Gestión de Líneas y Tareas</h1>
          <p>Crea líneas de acción y asigna tareas a las instituciones</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-primary-assign" onClick={() => setShowLineaForm(true)}>
            <Plus size={16} /> Crear Línea
          </button>
          <button className="btn-primary-assign" onClick={() => {
            if (lineas.length === 0) { showToast('Primero crea una Línea de Acción', 'warning'); return; }
            if (officers.length === 0) { showToast('Primero crea una Institución en Gestión de Usuarios', 'warning'); return; }
            setShowTareaForm(true);
          }}>
            <Plus size={16} /> Asignar Tarea
          </button>
        </div>
      </header>

      {/* ── Modal Crear Línea ── */}
      {showLineaForm && (
        <div className="assign-modal-overlay">
          <div className="assign-modal" style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: '#0b2240' }}>Nueva Línea de Acción</h3>
              <button onClick={() => setShowLineaForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateLinea}>
              <div className="form-row-grid">
                <div className="form-group">
                  <label>Problemática *</label>
                  <input type="text" placeholder="Ej: CONSUMO DE DROGA" value={newLinea.problematica} onChange={e => setNewLinea({...newLinea, problematica: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Zona</label>
                  <select value={newLinea.zona} onChange={e => setNewLinea({...newLinea, zona: e.target.value})}>
                    <option value="Barranca">Barranca</option>
                    <option value="Chacarita">Chacarita</option>
                    <option value="El Roble">El Roble</option>
                    <option value="Puntarenas">Puntarenas</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Línea de Acción *</label>
                <textarea placeholder="Descripción de la línea estratégica..." value={newLinea.lineaAccion} onChange={e => setNewLinea({...newLinea, lineaAccion: e.target.value})} />
              </div>
              <div className="form-row-grid">
                <div className="form-group">
                  <label>Indicador</label>
                  <input type="text" placeholder="Ej: Festivales realizados" value={newLinea.indicador} onChange={e => setNewLinea({...newLinea, indicador: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Meta</label>
                  <input type="text" placeholder="Ej: Red conformada" value={newLinea.meta} onChange={e => setNewLinea({...newLinea, meta: e.target.value})} />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowLineaForm(false)} className="btn-cancel">Cancelar</button>
                <button type="submit" className="btn-assign-submit">Crear Línea</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal Crear Tarea ── */}
      {showTareaForm && (
        <div className="assign-modal-overlay">
          <div className="assign-modal" style={{ maxWidth: '550px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: '#0b2240' }}>Asignar Tarea a Institución</h3>
              <button onClick={() => setShowTareaForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateTarea}>
              <div className="form-row-grid">
                <div className="form-group">
                  <label>Línea de Acción *</label>
                  <select value={newTarea.lineaAccionId} onChange={e => setNewTarea({...newTarea, lineaAccionId: e.target.value})}>
                    <option value="">-- Seleccionar --</option>
                    {lineas.map(l => (
                      <option key={l.id} value={l.id}>{l.id} · {l.problematica}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Institución Asignada *</label>
                  <select value={newTarea.institucionId} onChange={e => setNewTarea({...newTarea, institucionId: e.target.value})}>
                    <option value="">-- Seleccionar --</option>
                    {officers.map(o => (
                      <option key={o.id} value={o.id}>{o.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Título de la tarea *</label>
                <input type="text" placeholder="Ej: Firmar convenio con MEP" value={newTarea.titulo} onChange={e => setNewTarea({...newTarea, titulo: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Descripción (opcional)</label>
                <textarea placeholder="Detalle de lo que debe hacer la institución..." value={newTarea.descripcion} onChange={e => setNewTarea({...newTarea, descripcion: e.target.value})} />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowTareaForm(false)} className="btn-cancel">Cancelar</button>
                <button type="submit" className="btn-assign-submit">Asignar Tarea</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Stats ── */}
      <section className="actividad-oficiales__stats">
        <div className="actividad-stat actividad-stat--green">
          <div className="actividad-stat__icon"><CheckCircle size={24} /></div>
          <div className="actividad-stat__info">
            <span className="actividad-stat__value">{String(stats.tareasCompletadas).padStart(2,'0')}</span>
            <span className="actividad-stat__label">Tareas completadas</span>
          </div>
        </div>
        <div className="actividad-stat actividad-stat--blue">
          <div className="actividad-stat__icon"><Clock size={24} /></div>
          <div className="actividad-stat__info">
            <span className="actividad-stat__value">{String(stats.tareasPendientes).padStart(2,'0')}</span>
            <span className="actividad-stat__label">Tareas pendientes</span>
          </div>
        </div>
        <div className="actividad-stat actividad-stat--orange">
          <div className="actividad-stat__icon"><DollarSign size={24} /></div>
          <div className="actividad-stat__info">
            <span className="actividad-stat__value">{formatColones(stats.inversionTotal)}</span>
            <span className="actividad-stat__label">Inversión total</span>
          </div>
        </div>
      </section>

      {/* ── Líneas con Tareas ── */}
      <section className="actividad-history">
        <div className="actividad-history__header">
          <h2 className="actividad-history__title">Líneas de Acción y Tareas Asignadas</h2>
        </div>

        {lineas.length > 0 ? (
          lineas.map(linea => (
            <div key={linea.id} style={{ marginBottom: '16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
              {/* Línea Header */}
              <div
                onClick={() => setExpandedLinea(expandedLinea === linea.id ? null : linea.id)}
                style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}
              >
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{linea.id} · {linea.problematica}</div>
                  <div style={{ fontWeight: 700, color: '#0b2240', fontSize: '0.9rem', marginTop: '2px' }}>{linea.lineaAccion}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {/* Progress bar */}
                  <div style={{ width: '120px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 700, color: '#0b2240', marginBottom: '4px' }}>
                      <span>{linea.tareasCompletadas}/{linea.totalTareas}</span>
                      <span>{linea.progreso}%</span>
                    </div>
                    <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '10px' }}>
                      <div style={{ height: '100%', width: `${linea.progreso}%`, background: linea.progreso === 100 ? '#22c55e' : '#3b82f6', borderRadius: '10px', transition: 'width 0.3s' }} />
                    </div>
                  </div>
                  {expandedLinea === linea.id ? <ChevronUp size={18} color="#64748b" /> : <ChevronDown size={18} color="#64748b" />}
                </div>
              </div>

              {/* Tareas expandidas */}
              {expandedLinea === linea.id && (
                <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0' }}>
                  {linea.tareas && linea.tareas.length > 0 ? (
                    linea.tareas.map(tarea => (
                      <div key={tarea.id} style={{ padding: '12px 14px', marginBottom: '8px', background: tarea.completada ? '#f0fdf4' : '#fff', borderRadius: '8px', border: `1px solid ${tarea.completada ? '#bbf7d0' : '#e2e8f0'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {tarea.completada ? <CheckCircle size={18} color="#22c55e" /> : <Clock size={18} color="#94a3b8" />}
                          <div>
                            <div style={{ fontWeight: 700, color: '#0b2240', fontSize: '0.85rem' }}>{tarea.titulo}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              {tarea.institucionNombre} {tarea.completada && `· Completada ${tarea.fechaCompletada}`}
                            </div>
                            {tarea.completada && tarea.reporteInstitucion && (
                              <div style={{ fontSize: '0.78rem', color: '#334155', marginTop: '4px', fontStyle: 'italic' }}>"{tarea.reporteInstitucion}"</div>
                            )}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.75rem', color: '#64748b' }}>
                          {tarea.inversionColones > 0 && <span>{formatColones(tarea.inversionColones)}</span>}
                          <span className={`badge badge--${tarea.completada ? 'completada' : 'pendiente'}`}>{tarea.completada ? 'Completada' : 'Pendiente'}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: '#94a3b8', fontSize: '0.85rem', textAlign: 'center', padding: '1rem' }}>No hay tareas asignadas a esta línea todavía.</p>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
            <ListTodo size={40} style={{ marginBottom: '12px', opacity: 0.5 }} />
            <p>No hay líneas de acción creadas. Usá el botón <strong>"Crear Línea"</strong> para empezar.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default ActividadOficiales;
