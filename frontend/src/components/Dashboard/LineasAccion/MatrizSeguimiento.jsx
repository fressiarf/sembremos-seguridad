import React, { useState, useEffect, useTransition, useMemo } from 'react';
import { Search, Activity, FileDown, FileSpreadsheet, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Virtuoso } from 'react-virtuoso';
import useMatrizStore from '../../../store/useMatrizStore';
import './MatrizSeguimiento.css';
import SkeletonLoader from '../../Shared/SkeletonLoader';
import PageTransition from '../../Shared/PageTransition';

const MatrizSeguimiento = () => {
  const { lineas, tareas, loading, fetchData, getFilteredLineas } = useMatrizStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [deferredSearchTerm, setDeferredSearchTerm] = useState('');
  const [isPending, startTransition] = useTransition();
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    // Si ya hay datos, no hace falta recargar, aunque por seguridad podemos llamar a fetchData()
    // En este caso lo llamaremos siempre para tener datos frescos al montar
    fetchData();
  }, [fetchData]);

  // Actualizar el término de búsqueda de forma diferida (sin bloquear el teclado)
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    startTransition(() => {
      setDeferredSearchTerm(e.target.value);
    });
  };

  const filteredLineas = useMemo(() => {
    return getFilteredLineas(deferredSearchTerm);
  }, [deferredSearchTerm, lineas, getFilteredLineas]);

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
    doc.text(`Programa Sembremos Seguridad | Fecha: ${new Date().toLocaleDateString()}`, 14, 28);

    const tableData = lineas.map(l => [
      l.no || '-',
      l.canton || '-',
      l.problematica || '-',
      l.titulo || '-',
      l.objetivo || '-'
    ]);

    autoTable(doc, {
      startY: 35,
      head: [['No.', 'Cantón', 'Nombre de Línea Estratégica', 'Línea de Acción', 'Objetivo']],
      body: tableData,
      headStyles: { fillColor: [11, 34, 64], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 8, cellPadding: 3 },
      columnStyles: { 0: { cellWidth: 12 }, 4: { cellWidth: 60 } },
      margin: { top: 35 }
    });

    doc.save(`Matriz_Seguimiento_${new Date().getTime()}.pdf`);
  };

  const exportExcel = () => {
    const data = [];
    lineas.forEach(l => {
      const lineTareas = tareas.filter(t => t.lineaAccionId === l.id);
      
      const baseRowL = {
        'No.': l.no,
        'Cantón': l.canton,
        'Nombre de Línea Estratégica': l.problematica,
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
    XLSX.utils.book_append_sheet(wb, ws, 'Matriz Oficial');
    XLSX.writeFile(wb, `Matriz_SembremosSeguridad_${new Date().getTime()}.xlsx`);
  };

  if (loading && lineas.length === 0) return <PageTransition><SkeletonLoader type="table" /></PageTransition>;

  return (
    <PageTransition
      className="matriz-view-wrapper" 
      style={{ 
        background: `linear-gradient(rgba(11, 34, 64, 0.85), rgba(11, 34, 64, 0.85)), url('/bg-institucional.png')`,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="matriz-container-custom" style={{ marginTop: '3rem' }}>
        <div className="matriz-toolbar-v4">
          <div className="toolbar-info">
            <div className="matriz-search-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Search size={20} className="search-icon" />
              <input 
                type="text" 
                placeholder="Filtrar por línea de acción, objetivo o línea..." 
                value={searchTerm}
                onChange={handleSearchChange}
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 12px', borderRadius: '8px', fontSize: '0.85rem', maxWidth: '400px', width: '100%' }}
              />
              {isPending && <span style={{color: '#94a3b8', fontSize: '0.8rem'}}>Filtrando...</span>}
            </div>
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

        <div className="matriz-card-v4" style={{ height: '70vh' }}>
          <Virtuoso
            data={filteredLineas}
            style={{ height: '100%', width: '100%' }}
            components={{
              List: React.forwardRef((props, ref) => <table className="matriz-table-premium" ref={ref} {...props} />),
              Item: ({ children, ...props }) => <tbody {...props}>{children}</tbody>,
              Header: () => (
                <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: '#f8fafc' }}>
                  <tr>
                    <th className="col-no">No.</th>
                    <th className="col-canton">Cantón</th>
                    <th className="col-problematica">Nombre de Línea Estratégica</th>
                    <th className="col-titulo">Línea de Acción</th>
                    <th className="col-objetivo">Objetivo</th>
                    <th className="col-meta">Meta / Indicador</th>
                    <th className="col-responsables">Responsables</th>
                  </tr>
                </thead>
              ),
            }}
            itemContent={(index, linea) => (
              <React.Fragment>
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
                          <h3>PLANIFICACIÓN OPERATIVA 2025: Tareas Estratégicas Detalladas</h3>
                        </div>
                        <div className="plan-table-container">
                          <table className="plan-table-nested">
                            <thead>
                              <tr>
                                <th>Tarea Estratégica</th>
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
                                  <td colSpan="6" className="empty-subtable">Sin tareas estratégicas vinculadas actualmente.</td>
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
            )}
          />
        </div>
      </div>
    </PageTransition>
  );
};

export default MatrizSeguimiento;
