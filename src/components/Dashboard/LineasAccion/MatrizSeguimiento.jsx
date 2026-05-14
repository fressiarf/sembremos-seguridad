import React, { useState, useEffect } from 'react';
import heroImg from '../../../assets/hero.png';
import { Search, Activity, FileDown, FileSpreadsheet, FileText } from 'lucide-react';
import { dashboardService } from '../../../services/dashboardService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import './MatrizSeguimiento.css';

const MatrizSeguimiento = () => {
  const [lineas, setLineas] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dashboardService.getFullDashboardData();
        setLineas(data.lineasEnriquecidas || []);
        setTareas(data.tareas || []);
        setReportes(data.reportes || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching matriz data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredLineas = lineas.filter(l => 
    l.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.problematica?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.objetivo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const exportPDF = () => {
    const doc = jsPDF('l', 'mm', 'a4');
    doc.setFontSize(20);
    doc.setTextColor(11, 34, 64);
    doc.text('Matriz de Seguimiento Estratégico', 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Programa Sembremos Seguridad | Cantón: Puntarenas | Fecha: ${new Date().toLocaleDateString()}`, 14, 28);

    const tableData = lineas.map(l => [
      l.no || '-',
      l.canton || '-',
      l.problematica || '-',
      l.titulo || '-',
      l.objetivo || '-'
    ]);

    autoTable(doc, {
      startY: 35,
      head: [['No.', 'Cantón', 'Factores Priorizados', 'Línea de Acción', 'Objetivo']],
      body: tableData,
      headStyles: { fillColor: [11, 34, 64], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 8, cellPadding: 3 },
      columnStyles: { 0: { cellWidth: 12 }, 4: { cellWidth: 60 } },
      margin: { top: 35 }
    });

    doc.save(`Matriz_Seguimiento_Puntarenas_${new Date().getTime()}.pdf`);
  };

  const exportExcel = () => {
    const data = [];
    lineas.forEach(l => {
      const lineTareas = tareas.filter(t => t.lineaAccionId === l.id);
      
      const baseRowL = {
        'No.': l.no,
        'Cantón': l.canton,
        'Factores Priorizados': l.problematica,
        'Líneas de Acción Recomendadas': l.titulo,
        'Objetivo General': l.objetivo
      };

      if (lineTareas.length === 0) {
        data.push({
          ...baseRowL,
          'Acciones Estratégicas Específicas': 'Sin registrar',
          'Metas e Indicadores': l.indicador || l.metaIndicador || '-',
          'Consideraciones Técnicas': '-',
          'Instituciones Corresponsables y Directas': Array.isArray(l.responsables) ? l.responsables.join(', ') : (l.responsables || l.institucionLider || '-'),
          'Progreso (%)': 0
        });
      } else {
        lineTareas.forEach(t => {
          data.push({
            ...baseRowL,
            'Acciones Estratégicas Específicas': t.titulo,
            'Metas e Indicadores': `Meta: ${t.meta || '-'} / Indicador: ${t.indicador || '-'}`,
            'Consideraciones Técnicas': t.consideraciones || '-',
            'Instituciones Corresponsables y Directas': t.institucionNombre || 'Sin asignar',
            'Progreso (%)': t.progresoReal || 0
          });
        });
      }
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Matriz Oficial MSP');
    XLSX.writeFile(wb, `Matriz_SembremosSeguridad_Oficial_${new Date().getTime()}.xlsx`);
  };

  if (loading) return <div className="matriz-loading">Cargando matriz estratégica...</div>;

  return (
    <div 
      className="matriz-view-wrapper" 
      style={{ 
        background: `linear-gradient(rgba(11, 34, 64, 0.85), rgba(11, 34, 64, 0.85)), url('/bg-institucional.png')`,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="matriz-hero-banner">
        <div className="matriz-hero-content">
          <div className="banner-badge">MATRIZ DE CONTROL ESTRATÉGICO</div>
          <h1>Matriz de Seguimiento Estratégico</h1>
          <p>Consolidado de Indicadores y Avances · Cantón Puntarenas (Periodo 2025)</p>
          
          <div className="matriz-search-container">
            <div className="matriz-search-wrapper">
              <Search size={20} className="search-icon" />
              <input 
                type="text" 
                placeholder="Filtrar por línea de acción, objetivo o problemática priorizada..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="matriz-container-custom">
        <div className="matriz-toolbar-v4">
          <div className="toolbar-info">
            <Activity size={18} className="icon-pulse" />
            <span>Resumen Estratégico del Plan de Acción</span>
          </div>
          <div className="toolbar-actions">
             <button className="btn-export-v4 pdf" onClick={exportPDF} title="Generar ficher PDF Institucional">
                <FileText size={18} />
                <span>Exportar PDF</span>
             </button>
             <button className="btn-export-v4 excel" onClick={exportExcel} title="Exportar datos a hoja de cálculo">
                <FileSpreadsheet size={18} />
                <span>Hoja de Cálculo</span>
             </button>
          </div>
        </div>

        <div className="matriz-card-v4">
          <div className="matriz-table-scroll">
            <table className="matriz-table-premium">
              <thead>
                <tr>
                  <th className="col-no">No.</th>
                  <th className="col-canton">Cantón</th>
                  <th className="col-problematica">Factores Priorizados</th>
                  <th className="col-titulo">Línea de Acción</th>
                  <th className="col-objetivo">Objetivo</th>
                  <th className="col-meta">Meta / Indicador</th>
                  <th className="col-responsables">Responsables</th>
                </tr>
              </thead>
              <tbody>
                {filteredLineas.map((linea) => (
                  <React.Fragment key={linea.id}>
                    <tr onClick={() => toggleExpand(linea.id)} className={expandedId === linea.id ? 'row-expanded' : ''}>
                      <td className="col-no">{linea.no}</td>
                      <td className="col-canton">{linea.canton}</td>
                      <td className="col-problematica">{linea.problematica}</td>
                      <td className="col-titulo">
                        <div className="linea-title-main">{linea.titulo}</div>
                        <div className="tag-plazo">{linea.plazo || 'Anual'}</div>
                      </td>
                      <td className="col-objetivo">{linea.objetivo || 'Sin objetivo definido'}</td>
                      <td className="col-meta">
                        <div className="tag-meta-v2">{linea.meta}</div>
                        <div className="indicador-label">{linea.indicador}</div>
                      </td>
                      <td className="col-responsables">
                        <div className="responsables-flex">
                          {Array.isArray(linea.responsables) ? (
                            linea.responsables.map((r, i) => (
                              <span key={i} className="resp-pill">{r}</span>
                            ))
                          ) : (
                            <span className="resp-pill">{linea.institucionLider || 'Institución'}</span>
                          )}
                          {linea.corresponsables && (
                            <div className="corresp-label">
                              <strong>Co-gestores:</strong> {linea.corresponsables.join(', ')}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                    
                    {expandedId === linea.id && (
                      <tr className="planificacion-details-row">
                        <td colSpan="7">
                          <div className="planificacion-box">
                            <div className="plan-header">
                              <Activity size={18} />
                              <h3>PLANIFICACIÓN OPERATIVA 2025: Acciones Estratégicas Detalladas</h3>
                            </div>
                            <div className="plan-table-container">
                              <table className="plan-table-nested">
                                <thead>
                                  <tr>
                                    <th>Acción Estratégica</th>
                                    <th>Indicador de Avance</th>
                                    <th>Meta y Logro (Beneficiados)</th>
                                    <th>Inversión (₡)</th>
                                    <th>Líder</th>
                                    <th style={{ width: '130px' }}>Progreso y Estado</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {tareas.filter(t => t.lineaAccionId === linea.id).map(tarea => (
                                    <tr key={tarea.id}>
                                      <td className="cell-bold">{tarea.titulo}</td>
                                      <td>{tarea.indicador}</td>
                                      <td>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                          <span className="meta-tag-blue" style={{ background: '#eff6ff', color: '#1e40af' }}>Meta: {tarea.meta}</span>
                                          <span className="meta-tag-green" style={{ background: '#f0fdf4', color: '#166534', fontSize:'0.75rem', fontWeight:'600', padding:'2px 6px', borderRadius:'4px', display:'inline-block' }}>Logro Acum.: {tarea.avanceAcumulado || 0}</span>
                                        </div>
                                      </td>
                                      <td style={{ fontWeight: '600', color: '#0f172a' }}>
                                        {tarea.inversionColones ? `₡${tarea.inversionColones.toLocaleString('es-CR')}` : '₡0'}
                                      </td>
                                      <td className="cell-inst">{tarea.institucionNombre || 'N/A'}</td>
                                      <td>
                                        <div className="progress-group-mini">
                                          <div className="progress-bar-tiny">
                                            <div className="fill" style={{ width: `${tarea.progresoReal || 0}%`, backgroundColor: tarea.progresoReal >= 100 ? '#22c55e' : '#3b82f6' }}></div>
                                          </div>
                                          <span className="progress-text" style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>
                                            {tarea.progresoReal || 0}% - {tarea.estado || (tarea.completada ? 'Cerrada' : 'En Ejecución')}
                                          </span>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                  {tareas.filter(t => t.lineaAccionId === linea.id).length === 0 && (
                                    <tr>
                                      <td colSpan="6" className="empty-subtable">Sin acciones estratégicas vinculadas actualmente.</td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatrizSeguimiento;
