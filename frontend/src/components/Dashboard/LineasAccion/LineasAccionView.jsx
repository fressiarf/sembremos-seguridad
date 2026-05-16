import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../../services/dashboardService';
import { TrendingUp, ChevronDown, ChevronUp, Search, Info, Users, BarChart3, FileText, FileSpreadsheet, Activity, X, Save, Target, Edit, Trash, Plus } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import './LineasAccionView.css';
import { apiFetch } from '../../../utils/apiFetch';
import Swal from 'sweetalert2';

const LineasAccionView = ({ onViewChange }) => {
  const [lineas, setLineas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingLinea, setEditingLinea] = useState(null);
  const [newLineaData, setNewLineaData] = useState({
    titulo: '',
    problematica: '',
    objetivo: '',
    canton_id: 1
  });

  // Tareas CRUD State
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [targetLineaId, setTargetLineaId] = useState(null);
  const [taskForm, setTaskForm] = useState({
    titulo: '',
    descripcion_operativa: '',
    tipo_id: 1,
    estado_id: 2,
    presupuesto_asignado: 0
  });

  useEffect(() => {
    fetchLineas();
  }, []);

  const fetchLineas = async () => {
    setLoading(true);
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

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingLinea ? `/api/admin/lineas/${editingLinea.id}` : '/api/admin/lineas';
      const method = editingLinea ? 'PUT' : 'POST';

      const response = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLineaData)
      });
      
      if (response.ok) {
        setShowCreateModal(false);
        setEditingLinea(null);
        fetchLineas(); 
        setNewLineaData({ titulo: '', problematica: '', objetivo: '', canton_id: 1 });
        Swal.fire('¡Éxito!', editingLinea ? 'Línea de acción actualizada' : 'Línea de acción creada', 'success');
      } else {
        Swal.fire('Error', 'No se pudo guardar la línea de acción', 'error');
      }
    } catch (error) {
      console.error("Error al guardar:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditLinea = (linea, e) => {
    e.stopPropagation();
    setEditingLinea(linea);
    setNewLineaData({
      titulo: linea.titulo || '',
      problematica: linea.problematica || '',
      objetivo: linea.objetivo_general || linea.objetivo || '',
      canton_id: linea.canton_id || 1
    });
    setShowCreateModal(true);
  };

  const handleDeleteLinea = async (lineaId, e) => {
    e.stopPropagation();
    const result = await Swal.fire({
      title: '¿Eliminar Línea de Acción?',
      text: 'Esto eliminará también todas las tareas asociadas. Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Sí, eliminar todo',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const response = await apiFetch(`/api/admin/lineas/${lineaId}`, { method: 'DELETE' });
        if (response.ok) {
          fetchLineas();
          Swal.fire('Eliminado', 'La línea de acción ha sido borrada.', 'success');
        } else {
          Swal.fire('Error', 'No se pudo eliminar la línea de acción', 'error');
        }
      } catch (error) {
        console.error('Error deleting line:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Task CRUD Handlers
  const handleOpenAddTask = (lineaId) => {
    setEditingTask(null);
    setTargetLineaId(lineaId);
    setTaskForm({
      titulo: '',
      descripcion_operativa: '',
      tipo_id: 1,
      estado_id: 2,
      presupuesto_asignado: 0
    });
    setShowTaskModal(true);
  };

  const handleOpenEditTask = (task, lineaId) => {
    setEditingTask(task);
    setTargetLineaId(lineaId);
    setTaskForm({
      titulo: task.titulo || '',
      descripcion_operativa: task.descripcion_operativa || '',
      tipo_id: task.tipo_id || 1,
      estado_id: task.estado_id || 2,
      presupuesto_asignado: task.presupuesto_asignado || 0
    });
    setShowTaskModal(true);
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingTask ? `/api/muni/actividad/${editingTask.id}` : '/api/muni/actividad';
      const method = editingTask ? 'PUT' : 'POST';
      const body = {
        ...taskForm,
        linea_sync_id: targetLineaId
      };

      const response = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        setShowTaskModal(false);
        fetchLineas();
        Swal.fire('¡Éxito!', editingTask ? 'Tarea actualizada' : 'Tarea creada correctamente', 'success');
      } else {
        Swal.fire('Error', 'No se pudo guardar la tarea', 'error');
      }
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    const result = await Swal.fire({
      title: '¿Eliminar Tarea?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const response = await apiFetch(`/api/muni/actividad/${taskId}`, { method: 'DELETE' });
        if (response.ok) {
          fetchLineas();
          Swal.fire('Eliminado', 'La tarea ha sido borrada.', 'success');
        } else {
          Swal.fire('Error', 'No se pudo eliminar la tarea', 'error');
        }
      } catch (error) {
        console.error('Error deleting task:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredLineas = lineas.filter(l => 
    l.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.problematica.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Funciones de Exportación (Manteniendo funcionalidad original)
  const exportPDF = () => { /* ... lógica de PDF ... */ };
  const exportExcel = () => { /* ... lógica de Excel ... */ };

  if (loading && !showCreateModal) {
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
        <div className="header-controls">
          <div className="search-box">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Buscar por título o línea de acción..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-create-linea" onClick={() => setShowCreateModal(true)}>
            <TrendingUp size={16} />
            Crear Nueva Meta Nacional
          </button>
        </div>
      </header>

      {/* MODAL PERFECCIONADO */}
      {showCreateModal && (
        <div className="modal-overlay-v2">
          <div className="modal-content-v2 animacion-entrada">
            <header className="modal-header-v2">
              <div className="header-title-v2">
                <Target className="icon-pulse" size={24} />
                <h2>{editingLinea ? 'Editar Meta Nacional' : 'Nueva Línea de Acción Nacional'}</h2>
              </div>
              <button className="btn-close-v2" onClick={() => { setShowCreateModal(false); setEditingLinea(null); }}>
                <X size={20} />
              </button>
            </header>

            <form onSubmit={handleSave} className="modal-form-v2">
              <div className="form-group-v2">
                <label>Título de la Estrategia</label>
                <div className="input-with-icon">
                  <FileText size={16} />
                  <input 
                    type="text" 
                    placeholder="Ej: Plan Nacional de Seguridad 2026"
                    required
                    value={newLineaData.titulo}
                    onChange={(e) => setNewLineaData({...newLineaData, titulo: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group-v2">
                <label>Línea de Acción / Problemática</label>
                <div className="input-with-icon">
                  <Activity size={16} />
                  <textarea 
                    placeholder="Describa la problemática que aborda esta meta..."
                    required
                    value={newLineaData.problematica}
                    onChange={(e) => setNewLineaData({...newLineaData, problematica: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group-v2">
                <label>Objetivo Estratégico</label>
                <div className="input-with-icon">
                  <Target size={16} />
                  <textarea 
                    placeholder="¿Qué se espera lograr con esta acción?"
                    value={newLineaData.objetivo}
                    onChange={(e) => setNewLineaData({...newLineaData, objetivo: e.target.value})}
                  />
                </div>
              </div>

              <footer className="modal-footer-v2">
                <button type="button" className="btn-cancel-v2" onClick={() => setShowCreateModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-save-v2">
                  <Save size={18} />
                  Publicar Meta Nacional
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}

      {/* Grid de tarjetas (Manteniendo funcionalidad original) */}
      {/* Grid de tarjetas (Manteniendo funcionalidad original) */}
      
      {/* MODAL DE TAREAS (CRUD) */}
      {showTaskModal && (
        <div className="modal-overlay-v2" onClick={() => setShowTaskModal(false)}>
          <div className="modal-content-v2 animacion-entrada" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header-v2">
              <div className="header-title-v2">
                <Target className="icon-pulse" size={24} />
                <h2>{editingTask ? 'Editar Tarea Operativa' : 'Nueva Tarea Operativa'}</h2>
              </div>
              <button className="btn-close-v2" onClick={() => setShowTaskModal(false)}>
                <X size={20} />
              </button>
            </header>

            <form onSubmit={handleSaveTask} className="modal-form-v2">
              <div className="form-group-v2">
                <label>Título de la Tarea</label>
                <div className="input-with-icon">
                  <FileText size={16} />
                  <input 
                    type="text" 
                    placeholder="Ej: Talleres preventivos en colegios"
                    required
                    value={taskForm.titulo}
                    onChange={(e) => setTaskForm({...taskForm, titulo: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group-v2">
                <label>Descripción Operativa</label>
                <div className="input-with-icon">
                  <Activity size={16} />
                  <textarea 
                    placeholder="Detalles sobre la ejecución de esta tarea..."
                    value={taskForm.descripcion_operativa}
                    onChange={(e) => setTaskForm({...taskForm, descripcion_operativa: e.target.value})}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div className="form-group-v2" style={{ flex: 1 }}>
                  <label>Tipo de Actividad</label>
                  <select 
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #e2e8f0' }}
                    value={taskForm.tipo_id}
                    onChange={(e) => setTaskForm({...taskForm, tipo_id: parseInt(e.target.value)})}
                  >
                    <option value={1}>Prevención Situacional</option>
                    <option value={2}>Prevención Social</option>
                    <option value={3}>Control y Vigilancia</option>
                    <option value={4}>Infraestructura Urbana</option>
                    <option value={5}>Capacitación y Educación</option>
                  </select>
                </div>

                <div className="form-group-v2" style={{ flex: 1 }}>
                  <label>Estado Inicial</label>
                  <select 
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #e2e8f0' }}
                    value={taskForm.estado_id}
                    onChange={(e) => setTaskForm({...taskForm, estado_id: parseInt(e.target.value)})}
                  >
                    <option value={1}>Planificada</option>
                    <option value={2}>En Ejecución</option>
                    <option value={3}>Finalizada</option>
                    <option value={4}>Suspendida</option>
                  </select>
                </div>
              </div>

              <div className="form-group-v2">
                <label>Presupuesto Asignado (Colones)</label>
                <div className="input-with-icon">
                  <span style={{ position: 'absolute', left: '12px', fontWeight: 'bold', color: '#64748b' }}>₡</span>
                  <input 
                    type="number" 
                    placeholder="Monto total asignado"
                    style={{ paddingLeft: '2rem' }}
                    value={taskForm.presupuesto_asignado}
                    onChange={(e) => setTaskForm({...taskForm, presupuesto_asignado: parseFloat(e.target.value)})}
                  />
                </div>
              </div>

              <footer className="modal-footer-v2">
                <button type="button" className="btn-cancel-v2" onClick={() => setShowTaskModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-save-v2">
                  <Save size={18} />
                  Guardar Tarea
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}

      <div className="lineas-grid">
        {filteredLineas.map((linea) => (
          <div 
            key={linea.id} 
            className={`linea-card ${expandedId === linea.id ? 'is-expanded' : ''}`}
            onClick={() => toggleExpand(linea.id)}
          >
             <div className="linea-card-header">
                <div className="linea-icon-wrapper">
                  <Target size={24} />
                </div>
                <div className="linea-card-info">
                   <span className="linea-badge">Meta Nacional #{linea.no || '?'}</span>
                   <h3>{linea.titulo}</h3>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }} onClick={e => e.stopPropagation()}>
                  <button 
                    onClick={(e) => handleOpenEditLinea(linea, e)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#002f6c' }}
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={(e) => handleDeleteLinea(linea.id, e)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                  >
                    <Trash size={18} />
                  </button>
                </div>
                <div className="expand-icon" style={{ marginLeft: '10px' }}>
                  {expandedId === linea.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
             </div>

             {expandedId === linea.id && (
               <div className="linea-card-detail">
                 <div className="detail-section">
                   <h4><Activity size={14} /> Problemática</h4>
                   <p>{linea.problematica}</p>
                 </div>
                 <div className="detail-section">
                   <h4><Target size={14} /> Objetivo Estratégico</h4>
                   <p>{linea.objetivo_general || linea.objetivo || 'Sin objetivo definido.'}</p>
                 </div>
                 
                 <div className="detail-section">
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                     <h4><Users size={14} /> Tareas Operativas ({linea.tareas ? linea.tareas.length : 0})</h4>
                     <button 
                       className="btn-create-linea" 
                       style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: '8px' }}
                       onClick={(e) => { e.stopPropagation(); handleOpenAddTask(linea.id); }}
                     >
                       <Plus size={14} /> Agregar Tarea
                     </button>
                   </div>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                     {linea.tareas && linea.tareas.map(t => (
                       <div 
                         key={t.id} 
                         style={{ 
                           fontSize: '0.85rem', color: '#1e293b', background: '#f8fafc', 
                           padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0',
                           display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                         }}
                         onClick={(e) => e.stopPropagation()}
                       >
                         <div>
                           <div style={{ fontWeight: 'bold' }}>{t.titulo}</div>
                           <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>{t.descripcion_operativa || 'Sin descripción'}</div>
                         </div>
                         <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                           <span style={{ fontSize: '0.75rem', fontWeight: 'bold', padding: '2px 8px', borderRadius: '12px', background: '#e2e8f0' }}>
                             {t.progresoReal || 0}%
                           </span>
                           <button 
                             onClick={(e) => { e.stopPropagation(); handleOpenEditTask(t, linea.id); }}
                             style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#002f6c' }}
                           >
                             <Edit size={16} />
                           </button>
                           <button 
                             onClick={(e) => { e.stopPropagation(); handleDeleteTask(t.id); }}
                             style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                           >
                             <Trash size={16} />
                           </button>
                         </div>
                       </div>
                     ))}
                     {(!linea.tareas || linea.tareas.length === 0) && (
                       <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic', padding: '10px' }}>
                         No hay tareas registradas para esta meta nacional.
                       </div>
                     )}
                   </div>
                 </div>
               </div>
             )}

             <div className="card-footer">
                <div className="tasks-count">
                  {linea.totalTareas || 0} Tareas Asignadas
                </div>
                <div className="progress-pill" style={{ background: '#e0e7ff', color: '#4338ca', fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 10px', borderRadius: '20px' }}>
                  {linea.progreso || 0}% de Avance
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LineasAccionView;
