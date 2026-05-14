import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../../services/dashboardService';
import { FileText, FileSpreadsheet, Activity } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import './ReportesResultados.css';

const ReportesResultados = () => {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dashboardService.getFullDashboardData();
        // Enriquecer reportes con el nombre de la tarea
        const enrichedReportes = data.reportes
          .filter(rep => rep.estado === 'pendiente')
          .map(rep => {
            const tarea = data.tareas.find(t => t.id === rep.tareaId);
            return {
              ...rep,
              tareaNombre: tarea ? tarea.titulo : 'Tarea no encontrada',
              corresponsable: tarea ? tarea.corresponsable : '-'
            };
          });
        setReportes(enrichedReportes);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reportes data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(amount || 0);
  };

  const exportPDF = () => {
    const doc = jsPDF('l', 'mm', 'a4');
    doc.setFontSize(20);
    doc.setTextColor(11, 34, 64);
    doc.text('Reportes Activos / En Revisión', 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Programa Sembremos Seguridad | Consolidado Institucional | Fecha: ${new Date().toLocaleDateString()}`, 14, 28);

    const tableData = reportes.map(r => [
      r.tareaNombre?.substring(0, 40) + '...',
      r.tipoActividad || 'N/A',
      r.beneficiados || 0,
      r.departamento || '-',
      r.corresponsable || '-',
      formatCurrency(r.inversionColones),
      r.lugar || 'No indicado'
    ]);

    autoTable(doc, {
      startY: 35,
      head: [['Actividad / Tarea', 'Tipo', 'Beneficiados', 'Depto. Resp.', 'Corresponsable', 'Inversión', 'Ubicación']],
      body: tableData,
      headStyles: { fillColor: [11, 34, 64], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 8, cellPadding: 3 },
      columnStyles: { 0: { cellWidth: 50 }, 5: { cellWidth: 30 } },
      margin: { top: 35 }
    });

    doc.save(`Reportes_Activos_Puntarenas_${new Date().getTime()}.pdf`);
  };

  const exportExcel = () => {
    const data = reportes.map(r => ({
      'Actividad / Tarea': r.tareaNombre,
      'Tipo de Actividad': r.tipoActividad || 'N/A',
      'Total Beneficiados': r.beneficiados || 0,
      'Departamento Resp.': r.departamento || '-',
      'Institución Corresp.': r.corresponsable || '-',
      'Inversión (CRC)': r.inversionColones || 0,
      'Lugar': r.lugar || 'No indicado',
      'Niños': r.asistentes?.ninos || 0,
      'Jóvenes': r.asistentes?.jovenes || 0,
      'Adultos': r.asistentes?.adultos || 0,
      'Adultos Mayores': r.asistentes?.adultosMayores || 0,
      'Observaciones': r.descripcion
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reportes Activos');
    XLSX.writeFile(wb, `Reportes_Activos_Puntarenas_${new Date().getTime()}.xlsx`);
  };

  if (loading) return <div className="reportes-resultados-container">Cargando resultados obtenidos...</div>;

  return (
    <div 
      className="reportes-view-wrapper" 
      style={{ 
        background: `linear-gradient(rgba(11, 34, 64, 0.85), rgba(11, 34, 64, 0.85)), url('/bg-institucional.png')`,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="reportes-hero-banner">
        <div className="reportes-hero-content">
          <div className="banner-badge">REPORTES ACTIVOS / EN REVISIÓN</div>
          <h1>Gestión de Reportes Activos</h1>
          <p>Consolidado de actividades institucionales pendientes de validación técnica</p>
        </div>
      </div>

      <div className="reportes-container-custom">
        <div className="matriz-toolbar-v4" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '12px 24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div className="toolbar-info" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', color: '#0f172a' }}>
            <Activity size={18} color="#3b82f6" />
            <span>Extracción de Datos Oficiales</span>
          </div>
          <div className="toolbar-actions" style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={exportPDF} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
              <FileText size={16} /> Exportar PDF
            </button>
            <button onClick={exportExcel} style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
              <FileSpreadsheet size={16} /> Hoja de Cálculo
            </button>
          </div>
        </div>

        <div className="reportes-card">
          <div className="reportes-table-wrapper">
            <table className="reportes-table">
              <thead>
                <tr>
                  <th rowSpan="2">Actividades de Cumplimiento</th>
                  <th rowSpan="2">Tipo de Actividad</th>
                  <th rowSpan="2">Participantes Responsable</th>
                  <th rowSpan="2">Departamento Responsable</th>
                  <th rowSpan="2">Institución Corresponsable</th>
                  <th rowSpan="2">Inversión Presupuestal</th>
                  <th rowSpan="2">Lugar de la Actividad</th>
                  <th colSpan="4" className="header-group">Cantidad de Participantes</th>
                  <th rowSpan="2">Observaciones</th>
                </tr>
                <tr>
                  <th className="header-group">Niños</th>
                  <th className="header-group">Jóvenes</th>
                  <th className="header-group">Adultos</th>
                  <th className="header-group">A. Mayo.</th>
                </tr>
              </thead>
              <tbody>
                {reportes.map((rep) => (
                  <tr key={rep.id}>
                    <td style={{ minWidth: '200px', fontWeight: '500' }}>{rep.tareaNombre}</td>
                    <td className="col-tipo">{rep.tipoActividad || 'N/A'}</td>
                    <td className="col-num">{rep.beneficiados || 0}</td>
                    <td>{rep.departamento || 'No especificado'}</td>
                    <td>{rep.corresponsable_reporte || rep.corresponsable || '-'}</td>
                    <td className="col-monto">{formatCurrency(rep.inversionColones)}</td>
                    <td>{rep.lugar || 'No indicado'}</td>
                    <td className="col-num">{rep.asistentes?.ninos || 0}</td>
                    <td className="col-num">{rep.asistentes?.jovenes || 0}</td>
                    <td className="col-num">{rep.asistentes?.adultos || 0}</td>
                    <td className="col-num">{rep.asistentes?.adultosMayores || 0}</td>
                    <td style={{ fontSize: '0.65rem', color: '#64748b', fontStyle: 'italic' }}>
                      {rep.descripcion.substring(0, 100)}...
                      {rep.estado === 'rechazado' && (
                        <div style={{ color: '#ef4444', marginTop: '4px' }}>
                          <strong>Rechazado:</strong> {rep.observacionRechazo}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {reportes.length === 0 && (
                  <tr>
                    <td colSpan="12" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No hay reportes de resultados registrados actualmente.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportesResultados;
