import React, { useState, useEffect } from 'react';
import { muniService } from '../../../services/muniService';
import { useToast } from '../../../context/ToastContext';
import {
  CheckCircle, Clock, FileText, Users, MapPin,
  Calendar as CalIcon, DollarSign, Filter
} from 'lucide-react';
import './ReportesComunitarios.css';

const ReportesComunitarios = () => {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await muniService.getReportesComunitarios();
        setReportes(data);
      } catch (e) {
        showToast('Error al cargar reportes', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatColones = (amount) => {
    if (!amount || amount === 0) return '₡0';
    return '₡' + amount.toLocaleString('es-CR');
  };

  if (loading) return <div style={{ padding: '3rem', color: '#7a9cc4' }}>Cargando reportes comunitarios...</div>;

  const reportesFiltrados = reportes.filter(r => {
    if (filtroEstado === 'Aprobados') return r.estado === 'aprobado';
    if (filtroEstado === 'Pendientes') return r.estado === 'pendiente';
    if (filtroEstado === 'Rechazados') return r.estado === 'rechazado';
    return true;
  });

  const conteos = {
    todos: reportes.length,
    aprobados: reportes.filter(r => r.estado === 'aprobado').length,
    pendientes: reportes.filter(r => r.estado === 'pendiente').length,
    rechazados: reportes.filter(r => r.estado === 'rechazado').length,
  };

  return (
    <div style={{ padding: '2rem 2.5rem', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: '0 0 4px', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
          Reportes Comunitarios
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', margin: 0, textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
          Seguimiento de reportes de prevención social e infraestructura.
        </p>
      </div>

      {/* ── Resumen rápido ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="rep-com-mini-card" style={{ borderLeft: '4px solid #3b82f6' }}>
          <span className="rep-com-mini-label">Total</span>
          <span className="rep-com-mini-value">{conteos.todos}</span>
        </div>
        <div className="rep-com-mini-card" style={{ borderLeft: '4px solid #22c55e' }}>
          <span className="rep-com-mini-label">Aprobados</span>
          <span className="rep-com-mini-value">{conteos.aprobados}</span>
        </div>
        <div className="rep-com-mini-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <span className="rep-com-mini-label">Pendientes</span>
          <span className="rep-com-mini-value">{conteos.pendientes}</span>
        </div>
        <div className="rep-com-mini-card" style={{ borderLeft: '4px solid #ef4444' }}>
          <span className="rep-com-mini-label">Rechazados</span>
          <span className="rep-com-mini-value">{conteos.rechazados}</span>
        </div>
      </div>

      {/* ── Filtros ── */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
        {['Todos', 'Aprobados', 'Pendientes', 'Rechazados'].map(f => (
          <button
            key={f}
            onClick={() => setFiltroEstado(f)}
            style={{
              padding: '6px 16px',
              borderRadius: '999px',
              border: filtroEstado === f ? '2px solid #0d9488' : '1px solid #e2e8f0',
              background: filtroEstado === f ? '#ccfbf1' : '#ffffff',
              color: filtroEstado === f ? '#0d9488' : '#64748b',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ── Lista de Reportes ── */}
      {reportesFiltrados.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
          <Filter size={40} opacity={0.3} />
          <p style={{ margin: '8px 0 0', fontSize: '0.9rem' }}>No hay reportes con este filtro</p>
        </div>
      ) : (
        reportesFiltrados.map(r => {
          const estadoBadge = r.estado === 'aprobado'
            ? { bg: '#dcfce7', color: '#166534', label: 'Aprobado' }
            : r.estado === 'pendiente'
              ? { bg: '#fef3c7', color: '#92400e', label: 'Pendiente' }
              : { bg: '#fce7e7', color: '#991b1b', label: 'Rechazado' };

          const tipoBadge = r.tipoActividad === 'Social'
            ? { bg: '#e0e7ff', color: '#3730a3' }
            : r.tipoActividad === 'Infraestructura'
              ? { bg: '#ccfbf1', color: '#115e59' }
              : { bg: '#fef3c7', color: '#78350f' };

          return (
            <div key={r.id} className="rep-com-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ background: estadoBadge.bg, color: estadoBadge.color, fontSize: '0.65rem', fontWeight: 700, padding: '2px 10px', borderRadius: '999px', textTransform: 'uppercase' }}>
                      {estadoBadge.label}
                    </span>
                    <span style={{ background: tipoBadge.bg, color: tipoBadge.color, fontSize: '0.65rem', fontWeight: 700, padding: '2px 10px', borderRadius: '999px', textTransform: 'uppercase' }}>
                      {r.tipoActividad}
                    </span>
                  </div>
                  <h3 style={{ margin: '0 0 4px', fontSize: '0.95rem', fontWeight: 700, color: '#0b2240' }}>
                    {r.tarea?.titulo || `Reporte ${r.id}`}
                  </h3>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.72rem', color: '#94a3b8', minWidth: '100px' }}>
                  <CalIcon size={12} style={{ verticalAlign: 'middle' }} /> {r.fecha}
                </div>
              </div>

              {/* Descripción */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '10px 12px',
                marginBottom: '10px',
              }}>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#334155', lineHeight: 1.6 }}>
                  {r.descripcion}
                </p>
              </div>

              {/* Métricas */}
              <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem', color: '#64748b', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Users size={13} color="#3b82f6" /> {r.beneficiados} beneficiados
                </span>
                {r.inversionColones > 0 && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <DollarSign size={13} color="#8b5cf6" /> {formatColones(r.inversionColones)}
                  </span>
                )}
                {r.tarea?.zona && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={13} color="#0d9488" /> {r.tarea.zona}
                  </span>
                )}
                {r.tarea?.lineaNombre && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FileText size={13} color="#f59e0b" /> L#{r.tarea.lineaNumero} — {r.tarea.lineaNombre}
                  </span>
                )}
              </div>

              {/* Observación de rechazo si aplica */}
              {r.estado === 'rechazado' && r.observacionRechazo && (
                <div style={{ marginTop: '10px', background: '#fef2f2', borderLeft: '3px solid #ef4444', padding: '8px 12px', borderRadius: '0 6px 6px 0' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#991b1b', marginBottom: '2px' }}>MOTIVO DE RECHAZO</div>
                  <div style={{ fontSize: '0.8rem', color: '#7f1d1d', lineHeight: 1.4 }}>{r.observacionRechazo}</div>
                </div>
              )}

              {/* Fotos/evidencia */}
              {r.fotos && r.fotos.length > 0 && (
                <div style={{ marginTop: '10px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {r.fotos.map((foto, i) => (
                    <span key={i} style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', padding: '3px 10px', borderRadius: '6px', fontSize: '0.7rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      📎 {foto}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default ReportesComunitarios;
