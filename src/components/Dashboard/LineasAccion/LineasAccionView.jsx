import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../../services/dashboardService';
import { TrendingUp, ChevronDown, ChevronUp, Search, Info, Users, BarChart3, FileText, FileSpreadsheet, Activity } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import './LineasAccionView.css';

const LineasAccionView = ({ onViewChange }) => {
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

  const exportPDF = () => {
    const doc = jsPDF('l', 'mm', 'a4');
    doc.setFontSize(20);
    doc.setTextColor(11, 34, 64);
    doc.text('Líneas de Acción Estratégicas', 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Programa Sembremos Seguridad | Cantón: Puntarenas | Fecha: ${new Date().toLocaleDateString()}`, 14, 28);

    const tableData = filteredLineas.map(l => [
      l.no || '-',
      l.titulo || '-',
      l.problematica || '-',
      `${l.progreso}%`,
      Array.isArray(l.responsables) ? l.responsables.join(', ') : (l.responsables || l.institucionLider || '-')
    ]);

    autoTable(doc, {
      startY: 35,
      head: [['No.', 'Título', 'Problemática', 'Progreso', 'Responsables']],
      body: tableData,
      headStyles: { fillColor: [11, 34, 64], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 8, cellPadding: 3 },
      columnStyles: { 0: { cellWidth: 12 } },
      margin: { top: 35 }
    });

    doc.save(`Lineas_Accion_Puntarenas_${new Date().getTime()}.pdf`);
  };

  const exportExcel = () => {
    const data = [];
    filteredLineas.forEach(l => {
      const baseRow = {
        'No.': l.no,
        'Cantón': l.canton,
        'Título Línea de Acción': l.titulo,
        'Problemática Priorizada': l.problematica,
        'Objetivo General': l.objetivo || 'Sin objetivo definido',
        'Indicador Meta': l.indicador || l.metaIndicador || '-',
        'Progreso Línea (%)': l.progreso,
        'Inversión Total Línea (₡)': l.inversionLinea || 0,
        'Responsables Institucionales': Array.isArray(l.responsables) ? l.responsables.join(', ') : (l.responsables || l.institucionLider || '-')
      };

      if (!l.tareas || l.tareas.length === 0) {
        data.push({
          ...baseRow,
          'Tarea/Acción Específica': 'Sin tareas asignadas en esta línea',
          'Institución Ejecutora': '-',
          'Frecuencia': '-',
          'Trimestre': '-',
          'Progreso Tarea (%)': 0,
          'Estado de Tarea': '-',
          'Beneficiados (Logro)': '-',
          'Inversión Tarea (₡)': 0
        });
      } else {
        l.tareas.forEach(t => {
          data.push({
            ...baseRow,
            'Tarea/Acción Específica': t.titulo,
            'Institución Ejecutora': t.institucionNombre || 'Sin asignar',
            'Frecuencia': t.frecuencia || '-',
            'Trimestre': t.trimestre || '-',
            'Progreso Tarea (%)': t.progresoReal || 0,
            'Estado de Tarea': t.estado || (t.completada ? 'Cerrada' : 'En Ejecución'),
            'Beneficiados (Logro)': t.avanceAcumulado || 0,
            'Inversión Tarea (₡)': t.inversionColones || 0
          });
        });
      }
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Líneas y Tareas');
    XLSX.writeFile(wb, `Lineas_Estrategicas_SembremosSeguridad_${new Date().getTime()}.xlsx`);
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
          <button className="btn-export-v4 pdf" onClick={exportPDF} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FileText size={16} /> PDF
          </button>
          <button className="btn-export-v4 excel" onClick={exportExcel} style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FileSpreadsheet size={16} /> Excel
          </button>
          <button 
            className="btn-create-linea" 
            onClick={() => onViewChange('actividades')}
          >
            <TrendingUp size={16} />
            Crear Nueva
          </button>
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
                      <h4><TrendingUp size={14} /> Objetivo Estratégico</h4>
                      <p>{linea.objetivo || 'Sin objetivo definido'}</p>
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

                  {linea.tareas && linea.tareas.length > 0 && (
                    <div className="linea-tasks-list" style={{ marginTop: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a', marginBottom: '1rem', fontSize: '0.9rem' }}>
                        <Activity size={16} /> Tareas Asignadas a esta Línea
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {linea.tareas.map(t => (
                          <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.85rem' }}>{t.titulo}</span>
                              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Institución: {t.institucionNombre || 'Sin asignar'}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: t.completada ? '#10b981' : '#f59e0b' }}>
                                {t.progresoReal || 0}%
                              </span>
                              <span style={{ fontSize: '0.7rem', padding: '4px 8px', borderRadius: '12px', background: t.completada ? '#dcfce7' : '#fef3c7', color: t.completada ? '#166534' : '#92400e' }}>
                                {t.estado || (t.completada ? 'Cerrada' : 'Ejecución')}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
