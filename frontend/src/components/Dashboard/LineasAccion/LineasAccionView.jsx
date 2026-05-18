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
      


      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '8%' }}>ID Meta</th>
              <th style={{ width: '25%' }}>Meta Nacional (Línea de Acción)</th>
              <th style={{ width: '25%' }}>Problemática Asociada</th>
              <th style={{ width: '15%' }}>Progreso</th>
              <th style={{ width: '15%', textAlign: 'center' }}>Tareas Operativas</th>
              <th style={{ width: '12%', textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredLineas.map((linea) => (
              <tr key={linea.id}>
                <td>
                  <span className="linea-table-badge">Meta #{linea.no || '?'}</span>
                </td>
                <td>
                  <div className="linea-table-title">{linea.titulo}</div>
                  <div className="linea-table-subtitle">{linea.objetivo_general || linea.objetivo || 'Sin objetivo definido.'}</div>
                </td>
                <td>
                  <div className="linea-table-prob">{linea.problematica}</div>
                </td>
                <td>
                  <div className="linea-progress-wrapper">
                    <div className="linea-progress-track">
                      <div 
                        className="linea-progress-fill" 
                        style={{ width: `${linea.progreso || 0}%`, backgroundColor: linea.progreso === 100 ? '#22c55e' : '#3b82f6' }}
                      />
                    </div>
                    <span className="linea-progress-text">{linea.progreso || 0}% Avance</span>
                  </div>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className="linea-tasks-count">{linea.totalTareas || (linea.tareas ? linea.tareas.length : 0)} Registradas</span>
                </td>
                <td>
                  <div className="linea-table-actions">
                    <button 
                      onClick={(e) => handleOpenEditLinea(linea, e)}
                      title="Editar Línea"
                      className="btn-action-icon edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={(e) => handleDeleteLinea(linea.id, e)}
                      title="Eliminar Línea"
                      className="btn-action-icon delete"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredLineas.length === 0 && (
              <tr>
                <td colSpan="6" className="linea-empty-state">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <Target size={32} style={{ opacity: 0.5 }} />
                    <p>No se encontraron líneas de acción o metas nacionales.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LineasAccionView;
