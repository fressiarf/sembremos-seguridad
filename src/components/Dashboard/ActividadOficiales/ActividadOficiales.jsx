import React, { useState, useEffect } from 'react';
import './ActividadOficiales.css';
import { useToast } from '../../../context/ToastContext';
import { dashboardService } from '../../../services/dashboardService';
import { userService } from '../../../services/userService';
import { useLogin } from '../../../context/LoginContext';
import { Users, Edit, Plus, X, ListTodo, MapPin, DollarSign, CheckCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';

const LOCATION_DATA = {
  "Puntarenas": {
    "Puntarenas": ["Puntarenas Centro", "Barranca", "El Roble", "Chacarita", "Fray Casiano", "El Carmen"],
    "Esparza": ["Espíritu Santo", "San Juan", "Macacona", "San Rafael", "San Jerónimo"]
  },
  "San José": {
    "San José": ["Carmen", "Merced", "Hospital", "Catedral", "Zapote", "San Francisco de Dos Ríos", "Uruca", "Mata Redonda", "Pavas", "Hatillo", "San Sebastián"]
  }
};

const ActividadOficiales = () => {
  const { user } = useLogin();
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
    canton: 'Puntarenas', 
    problematica: '', 
    titulo: '',
    indicador: '',
    meta: '',
    plazo: 'Anual',
    institucionesLideres: [] // Array de IDs
  });

  const [newTarea, setNewTarea] = useState({
    lineaAccionId: '', titulo: '', indicador: '', consideraciones: '', meta: '',
    plazo: 'Anual', institucionesIds: [], corresponsable: '',
    provincia: '', canton: '', distrito: '',
    tipo: 1, presupuestoEstimado: '', detalleMeta: '',
    seguimientoTipo: 'numerico', hitos: []
  });

  const [mostrarTodasInstituciones, setMostrarTodasInstituciones] = useState(false);

  const formatColones = (amount) => {
    if (!amount || amount === 0) return '₡0';
    return '₡' + amount.toLocaleString('es-CR');
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const dashData = await dashboardService.getFullDashboardData();
      const allUsers = await userService.getUsers();
      const onlyOfficers = allUsers.filter(u => u.rol === 'adminInstitucion');
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

  const handleCreateLinea = async (e) => {
    e.preventDefault();
    if (!newLinea.problematica || !newLinea.titulo || !newLinea.indicador || !newLinea.meta) {
      showToast('Completa los campos obligatorios (*)', 'warning');
      return;
    }
    if (newLinea.institucionesLideres.length === 0) {
      showToast('Selecciona al menos una Institución Promotora', 'warning');
      return;
    }
    try {
      const lineaId = `LA-${Date.now().toString().slice(-4)}`;
      await dashboardService.createLineaAccion({ ...newLinea, id: lineaId, no: lineas.length + 1 });
      showToast('Línea de acción creada ✓', 'success');
      setShowLineaForm(false);
      setNewLinea({ 
        canton: 'Puntarenas', problematica: '', titulo: '',
        indicador: '', meta: '', plazo: 'Anual', institucionesLideres: []
      });
      loadData();
    } catch (error) {
      showToast('Error al crear la línea', 'error');
    }
  };

  // ── Crear Tarea ──
  const handleCreateTarea = async (e) => {
    e.preventDefault();
    if (!newTarea.lineaAccionId || !newTarea.titulo || newTarea.institucionesIds.length === 0) {
      showToast('Selecciona línea, título y al menos una institución (*)', 'warning');
      return;
    }
    try {
      const institucionesSeleccionadas = officers.filter(o => newTarea.institucionesIds.includes(o.id));
      const nombresInstituciones = institucionesSeleccionadas.map(o => o.institucion).join(', ');

      await dashboardService.createTarea({
        ...newTarea,
        institucionNombre: nombresInstituciones || 'Sin institución',
        zona: newTarea.distrito ? `${newTarea.distrito}, ${newTarea.canton}` : 'General'
      });
      showToast('Tarea creada y asignada ✓', 'success');
      setShowTareaForm(false);
      setNewTarea({ 
        lineaAccionId: '', titulo: '', indicador: '', consideraciones: '', meta: '', 
        plazo: 'Anual', institucionesIds: [], corresponsable: '', 
        provincia: '', canton: '', distrito: '', 
        tipo: 1, presupuestoEstimado: '', detalleMeta: '',
        seguimientoTipo: 'numerico', hitos: []
      });
      setMostrarTodasInstituciones(false);
      loadData();
    } catch (error) {
      showToast('Error al crear la tarea', 'error');
    }
  };

  // Helper para Tareas: Determinar instituciones que se muestran a seleccionar
  const lineaGuardada = lineas.find(l => l.id === newTarea.lineaAccionId);
  const tieneFiltro = lineaGuardada && lineaGuardada.institucionesLideres && lineaGuardada.institucionesLideres.length > 0;
  
  let opcionesInstituciones = officers;
  if (newTarea.lineaAccionId && tieneFiltro && !mostrarTodasInstituciones) {
    opcionesInstituciones = officers.filter(o => lineaGuardada.institucionesLideres.includes(o.id));
  }

  if (loading) return <div style={{ padding: '3rem', color: '#7a9cc4' }}>Cargando...</div>;

  return (
    <div className="actividad-oficiales">
      <header className="actividad-oficiales__header">
        <div className="actividad-oficiales__title-block">
          <h1>Gestión de Líneas y Tareas</h1>
          <p>Crea líneas de acción y asigna tareas a las instituciones</p>
        </div>
        {user?.rol !== 'auditor' && (
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
        )}
      </header>

      {/* ── Modal Crear Línea ── */}
      {showLineaForm && (
        <div className="assign-modal-overlay" style={{ zIndex: 1000, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="assign-modal" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', backgroundColor: '#fff', borderRadius: '8px', padding: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: '#0b2240' }}>Nueva Línea de Acción</h3>
              <button onClick={() => setShowLineaForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateLinea}>
              <div className="form-row-grid">
                <div className="form-group">
                  <label>Problemática Priorizada *</label>
                  <input type="text" placeholder="Ej: CONSUMO DE DROGAS Y ALCOHOL" value={newLinea.problematica} onChange={e => setNewLinea({...newLinea, problematica: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Cantón / Territorio</label>
                  <select value={newLinea.canton} onChange={e => setNewLinea({...newLinea, canton: e.target.value})}>
                    <option value="Puntarenas">Puntarenas</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Nombre de la Línea de Acción (Estrategia Macro) *</label>
                <textarea placeholder="Descripción del objetivo general o línea de acción estratégica..." value={newLinea.titulo} onChange={e => setNewLinea({...newLinea, titulo: e.target.value})} rows="2" />
              </div>

              <div className="form-row-grid">
                <div className="form-group">
                  <label>Indicador de la Estrategia *</label>
                  <input type="text" placeholder="Ej: Variación de incidentes delictivos" value={newLinea.indicador} onChange={e => setNewLinea({...newLinea, indicador: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Meta Global *</label>
                  <input type="text" placeholder="Ej: Reducir 15% los incidentes en el cantón" value={newLinea.meta} onChange={e => setNewLinea({...newLinea, meta: e.target.value})} />
                </div>
              </div>

              <div className="form-row-grid">
                <div className="form-group">
                  <label>Insitución Promotora / Líder (Múltiple) *</label>
                  <div className="checkbox-list-container" style={{ maxHeight: '160px', overflowY: 'auto', border: '1px solid #cbd5e1', padding: '12px', borderRadius: '6px', backgroundColor: '#f8fafc', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)' }}>
                    {officers.map(o => (
                      <label key={o.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '6px 0', cursor: 'pointer', fontSize: '13px', color: '#334155', borderBottom: '1px solid #e2e8f0' }}>
                        <input 
                          type="checkbox" 
                          style={{ marginTop: '2px', cursor: 'pointer' }}
                          checked={newLinea.institucionesLideres.includes(o.id)}
                          onChange={e => {
                            if (e.target.checked) {
                              setNewLinea(prev => ({ ...prev, institucionesLideres: [...prev.institucionesLideres, o.id] }));
                            } else {
                              setNewLinea(prev => ({ ...prev, institucionesLideres: prev.institucionesLideres.filter(id => id !== o.id) }));
                            }
                          }}
                        />
                        {o.institucion} ({o.nombre})
                      </label>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>Plazo Estratégico</label>
                  <select value={newLinea.plazo} onChange={e => setNewLinea({...newLinea, plazo: e.target.value})}>
                    <option value="Anual">Cierre Anual</option>
                    <option value="Semestral">Cierre Semestral</option>
                    <option value="Cuatrimestral">Cierre Cuatrimestral</option>
                    <option value="Bimestral">Cierre Bimestral</option>
                  </select>
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

  // ── Modal Crear Tarea ──
  {showTareaForm && (
    <div className="assign-modal-overlay" style={{ zIndex: 1000, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="assign-modal" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', backgroundColor: '#fff', borderRadius: '8px', padding: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
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
                  <option key={l.id} value={l.id}>{l.titulo} (Problema: {l.problematica})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Institución Asignada (Múltiple) *
                {tieneFiltro && (
                  <label style={{ fontSize: '11px', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontWeight: 'normal' }}>
                    <input 
                      type="checkbox" 
                      checked={mostrarTodasInstituciones} 
                      onChange={e => setMostrarTodasInstituciones(e.target.checked)}
                      style={{ margin: 0, width: 'auto' }}
                    />
                    Mostrar Todas (Colaboración)
                  </label>
                )}
              </label>
              <div className="checkbox-list-container" style={{ maxHeight: '160px', overflowY: 'auto', border: '1px solid #cbd5e1', padding: '12px', borderRadius: '6px', backgroundColor: '#f8fafc', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)' }}>
                {opcionesInstituciones.length === 0 && <span style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>No hay instituciones asociadas a esta Línea. Activa "Mostrar Todas".</span>}
                {opcionesInstituciones.map(o => (
                  <label key={o.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '6px 0', cursor: 'pointer', fontSize: '13px', color: '#334155', borderBottom: '1px solid #e2e8f0' }}>
                    <input 
                      type="checkbox" 
                      style={{ marginTop: '2px', cursor: 'pointer' }}
                      checked={newTarea.institucionesIds.includes(o.id)}
                      onChange={e => {
                        if (e.target.checked) {
                          setNewTarea(prev => ({ ...prev, institucionesIds: [...prev.institucionesIds, o.id] }));
                        } else {
                          setNewTarea(prev => ({ ...prev, institucionesIds: prev.institucionesIds.filter(id => id !== o.id) }));
                        }
                      }}
                    />
                    {o.institucion} ({o.nombre})
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="form-row-grid">
            <div className="form-group">
              <label>Tipo de Tarea Estratégica *</label>
              <select value={newTarea.tipo} onChange={e => setNewTarea({...newTarea, tipo: parseInt(e.target.value), meta: '', detalleMeta: '', indicador: ''})}>
                <option value="1">Tipo 1: Prevensión Social / Comunitaria</option>
                <option value="2">Tipo 2: Infraestructura / Obra Física</option>
                <option value="3">Tipo 3: Seguridad / Operativo Policial</option>
                <option value="4">Tipo 4: Gestión / Redes Interinstitucionales</option>
                <option value="5">Tipo 5: Inversión / Entrega de Recursos</option>
              </select>
            </div>
            <div className="form-group">
              <label>Presupuesto Estimado / Inversión (₡) *</label>
              <input type="number" placeholder="Ej: 5000000" value={newTarea.presupuestoEstimado} onChange={e => setNewTarea({...newTarea, presupuestoEstimado: parseInt(e.target.value) || 0})} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Título / Nombre de la Tarea *</label>
            <input type="text" placeholder="Ej: Construcción de red de cámaras, o Talleres en Colegios..." value={newTarea.titulo} onChange={e => setNewTarea({...newTarea, titulo: e.target.value})} />
          </div>

          <div className="form-group" style={{ marginBottom: '1.2rem', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <label style={{ fontWeight: 700, color: '#0f172a', marginBottom: '8px', display: 'block' }}>Modelo de Seguimiento de Progreso</label>
            <div style={{ display: 'flex', gap: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                <input type="radio" name="seguimiento" checked={newTarea.seguimientoTipo === 'numerico'} onChange={() => setNewTarea({...newTarea, seguimientoTipo: 'numerico', hitos: []})} />
                Numérico Acumulativo (Ej: 50 Personas, 10 Charlas)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                <input type="radio" name="seguimiento" checked={newTarea.seguimientoTipo === 'hitos'} onChange={() => {
                  const defaultHitos = newTarea.tipo === 2 ? [
                    { id: 1, label: 'Diseño/Preinversión', completado: false },
                    { id: 2, label: 'Licitación/Adjudicación', completado: false },
                    { id: 3, label: 'Construcción 50%', completado: false },
                    { id: 4, label: 'Construcción 100%', completado: false },
                    { id: 5, label: 'Entrega/Mantenimiento', completado: false }
                  ] : [
                    { id: 1, label: 'Fase 1: Planificación', completado: false },
                    { id: 2, label: 'Fase 2: Ejecución', completado: false },
                    { id: 3, label: 'Fase 3: Evaluación', completado: false }
                  ];
                  setNewTarea({...newTarea, seguimientoTipo: 'hitos', hitos: defaultHitos, meta: 100, detalleMeta: 'Hitos'});
                }} />
                Por Hitos / Fases (Checklist de etapas)
              </label>
            </div>
          </div>
          
          {newTarea.seguimientoTipo === 'numerico' ? (
            <div className="form-row-grid" style={{ backgroundColor: '#f0f9ff', padding: '15px', borderRadius: '6px', border: '1px solid #bae6fd', marginBottom: '1.2rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ color: '#0369a1' }}>
                  {newTarea.tipo === 1 ? 'Meta Cuantitativa (Personas a Impactar) *' :
                   newTarea.tipo === 2 ? 'Meta: Avance Físico de la Obra (%) *' :
                   newTarea.tipo === 3 ? 'Meta: Cantidad de Operativos a Ejecutar *' :
                   newTarea.tipo === 4 ? 'Meta: Reuniones o Acuerdos a Lograr *' : 
                   'Meta: Cantidad de Entregas o Beneficios *'}
                </label>
                <input type="number" 
                  placeholder={newTarea.tipo === 2 ? "Máximo 100" : "Ej: 50"} 
                  value={newTarea.meta} 
                  onChange={e => setNewTarea({...newTarea, meta: parseInt(e.target.value) || ''})} 
                />
              </div>
              
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ color: '#0369a1' }}>
                  {newTarea.tipo === 1 ? 'Población Objetivo *' :
                   newTarea.tipo === 2 ? 'Fase de la Construcción *' :
                   newTarea.tipo === 3 ? 'Frecuencia Táctica *' :
                   newTarea.tipo === 4 ? 'Nivel de Coordinación *' : 
                   'Población / Entidad Beneficiaria *'}
                </label>
                {newTarea.tipo === 1 ? (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      list="social-meta-options"
                      type="text" 
                      placeholder="Ej: Personas, Escuelas, Charlas..." 
                      value={newTarea.detalleMeta} 
                      onChange={e => setNewTarea({...newTarea, detalleMeta: e.target.value})} 
                    />
                    <datalist id="social-meta-options">
                      <option value="Personas beneficiadas" />
                      <option value="Jóvenes (12-18)" />
                      <option value="Niños (0-11)" />
                      <option value="Adultos" />
                      <option value="Centros Educativos" />
                    </datalist>
                  </div>
                ) : newTarea.tipo === 2 ? (
                  <select value={newTarea.detalleMeta} onChange={e => setNewTarea({...newTarea, detalleMeta: e.target.value})}>
                    <option value="">Seleccionar Fase...</option>
                    <option value="Preinversión / Diseño">Preinversión / Diseño</option>
                    <option value="Licitación / Adjudicación">Licitación / Adjudicación</option>
                    <option value="Construcción / Ejecución">Construcción / Ejecución</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                  </select>
                ) : newTarea.tipo === 3 ? (
                  <select value={newTarea.detalleMeta} onChange={e => setNewTarea({...newTarea, detalleMeta: e.target.value})}>
                    <option value="">Seleccionar Frecuencia...</option>
                    <option value="Diaria">Diaria</option>
                    <option value="Semanal">Semanal</option>
                    <option value="Mensual">Mensual</option>
                    <option value="Megaoperativo">Megaoperativo</option>
                  </select>
                ) : newTarea.tipo === 4 ? (
                  <select value={newTarea.detalleMeta} onChange={e => setNewTarea({...newTarea, detalleMeta: e.target.value})}>
                    <option value="">Seleccionar Nivel...</option>
                    <option value="Nivel Local / Cantonal">Nivel Local / Cantonal</option>
                    <option value="Nivel Regional">Nivel Regional</option>
                    <option value="Nivel Nacional">Nivel Nacional</option>
                  </select>
                ) : (
                  <input type="text" placeholder="Ej: Computadoras, Kits, ADI..." value={newTarea.detalleMeta} onChange={e => setNewTarea({...newTarea, detalleMeta: e.target.value})} />
                )}
              </div>
            </div>
          ) : (
            /* SEGUIMIENTO POR HITOS / FASES */
            <div style={{ backgroundColor: '#fdf4ff', padding: '15px', borderRadius: '6px', border: '1px solid #f5d0fe', marginBottom: '1.2rem' }}>
              <label style={{ color: '#86198f', fontWeight: 700, marginBottom: '10px', display: 'block' }}>Configuración de Hitos / Fases de Avance</label>
              
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <input 
                  type="text" 
                  id="new-hito-input"
                  placeholder="Ej: Fase 1: Diagnóstico..." 
                  className="fr-input"
                  style={{ flex: 1 }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = e.target.value.trim();
                      if (val) {
                        setNewTarea(prev => ({
                          ...prev,
                          hitos: [...prev.hitos, { id: Date.now(), label: val, completado: false }]
                        }));
                        e.target.value = '';
                      }
                    }
                  }}
                />
                <button 
                  type="button" 
                  className="btn-primary-assign"
                  style={{ width: 'auto', padding: '0 15px' }}
                  onClick={() => {
                    const input = document.getElementById('new-hito-input');
                    const val = input.value.trim();
                    if (val) {
                      setNewTarea(prev => ({
                        ...prev,
                        hitos: [...prev.hitos, { id: Date.now(), label: val, completado: false }]
                      }));
                      input.value = '';
                    }
                  }}
                >
                  Agregar
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {newTarea.hitos.map((hito, index) => (
                  <div key={hito.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '6px 10px', borderRadius: '4px', border: '1px solid #f0abfc' }}>
                    <span style={{ fontSize: '13px', color: '#701a75' }}>{index + 1}. {hito.label}</span>
                    <button 
                      type="button" 
                      onClick={() => setNewTarea(prev => ({ ...prev, hitos: prev.hitos.filter(h => h.id !== hito.id) }))}
                      style={{ background: 'none', border: 'none', color: '#be185d', cursor: 'pointer' }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {newTarea.hitos.length === 0 && (
                  <div style={{ fontSize: '12px', color: '#a21caf', fontStyle: 'italic' }}>No hay hitos definidos. Agregá al menos uno.</div>
                )}
              </div>
            </div>
          )}

          <div className="form-row-grid">
            <div className="form-group">
              <label>Plazo Estratégico *</label>
              <select value={newTarea.plazo} onChange={e => setNewTarea({...newTarea, plazo: e.target.value})}>
                <option value="Anual">Anual</option>
                <option value="Bimestral">Bimestral</option>
                <option value="Cuatrimestral">Cuatrimestral</option>
              </select>
            </div>
            <div className="form-group">
              <label>Co-gestor / Aliado (Colaborador sin sistema)</label>
              <input type="text" placeholder="Ej: OIJ, PANI..." value={newTarea.corresponsable} onChange={e => setNewTarea({...newTarea, corresponsable: e.target.value})} />
            </div>
          </div>

          <div className="form-row-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
            <div className="form-group">
              <label>Provincia</label>
              <select value={newTarea.provincia} onChange={e => setNewTarea({...newTarea, provincia: e.target.value, canton: '', distrito: ''})}>
                <option value="">-- Provincia --</option>
                {Object.keys(LOCATION_DATA).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Cantón</label>
              <select value={newTarea.canton} onChange={e => setNewTarea({...newTarea, canton: e.target.value, distrito: ''})} disabled={!newTarea.provincia}>
                <option value="">-- Cantón --</option>
                {newTarea.provincia && Object.keys(LOCATION_DATA[newTarea.provincia]).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Distrito</label>
              <select value={newTarea.distrito} onChange={e => setNewTarea({...newTarea, distrito: e.target.value})} disabled={!newTarea.canton}>
                <option value="">-- Distrito --</option>
                {newTarea.canton && LOCATION_DATA[newTarea.provincia][newTarea.canton].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Consideraciones / Objetivo</label>
            <textarea placeholder="Consideraciones o instrucciones..." value={newTarea.consideraciones} onChange={e => setNewTarea({...newTarea, consideraciones: e.target.value})} />
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
                  <div style={{ fontWeight: 700, color: '#0b2240', fontSize: '0.9rem', marginTop: '2px' }}>{linea.titulo}</div>
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
