import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../../services/dashboardService';
import './ReportesResultados.css';

const ReportesResultados = () => {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dashboardService.getFullDashboardData();
        // Enriquecer reportes con el nombre de la tarea
        const enrichedReportes = data.reportes.map(rep => {
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

  if (loading) return <div className="reportes-resultados-container">Cargando resultados obtenidos...</div>;

  return (
    <div className="reportes-resultados-container">
      <div className="reportes-header" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ffffff' }}>Resultados Obtenidos</h1>
        <p style={{ color: '#cbd5e1' }}>Consolidado institucional de actividades de cumplimiento y métricas de impacto.</p>
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
  );
};

export default ReportesResultados;
