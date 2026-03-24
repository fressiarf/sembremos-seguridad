import React, { useState, useEffect } from 'react';
import { adminInstitucionService } from '../../../services/adminInstitucionService';
import { useToast } from '../../../context/ToastContext';
import { FileSearch, CheckCircle, XCircle, Users, Calendar, Camera, Target, Activity, Image } from 'lucide-react';
import '../AdminInstitucion.css';

const RevisionReportes = () => {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rechazandoId, setRechazandoId] = useState(null);
  const [observacion, setObservacion] = useState('');
  const { showToast } = useToast();

  const loadReportes = async () => {
    try {
      setLoading(true);
      const data = await adminInstitucionService.getReportesPendientes();
      setReportes(data);
    } catch (e) {
      showToast('Error al cargar reportes', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadReportes(); }, []);

  const handleAprobar = async (reporteId) => {
    try {
      const result = await adminInstitucionService.aprobarReporte(reporteId);
      if (result.success) {
        showToast('Reporte aprobado ✅ — Enviado al Admin Global', 'success');
        loadReportes();
      }
    } catch (e) {
      showToast('Error al aprobar', 'error');
    }
  };

  const handleRechazar = async (reporteId) => {
    if (!observacion.trim()) {
      showToast('La observación es obligatoria al rechazar', 'warning');
      return;
    }
    try {
      const result = await adminInstitucionService.rechazarReporte(reporteId, observacion.trim());
      if (result.success) {
        showToast('Reporte rechazado ❌ — Devuelto al responsable', 'info');
        setRechazandoId(null);
        setObservacion('');
        loadReportes();
      }
    } catch (e) {
      showToast('Error al rechazar', 'error');
    }
  };

  if (loading) return <div style={{ padding: '3rem', color: '#7a9cc4' }}>Cargando reportes...</div>;

  return (
    <div style={{ padding: '2rem 2.5rem', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: '0 0 4px', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
          Revisión de Reportes
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', margin: 0, textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
          Revisa, aprueba o rechaza los reportes subidos por tus responsables.
        </p>
      </div>

      {reportes.length === 0 ? (
        <div className="admin-inst-empty">
          <FileSearch size={48} opacity={0.3} />
          <h3>No hay reportes pendientes de revisión</h3>
          <p>Todos los reportes han sido procesados.</p>
        </div>
      ) : (
        reportes.map(reporte => (
          <div key={reporte.id} className="admin-inst-report-card">
            {/* Header */}
            <div className="admin-inst-report-header">
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span className="admin-inst-badge admin-inst-badge--pendiente">Pendiente</span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                    <Activity size={12} style={{ verticalAlign: 'middle' }} /> L#{reporte.tarea?.lineaNumero} — {reporte.tarea?.lineaNombre}
                  </span>
                </div>
                <h3 style={{ margin: '0 0 4px', fontSize: '1.05rem', fontWeight: 700, color: '#0b2240' }}>
                  {reporte.tarea?.titulo}
                </h3>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, marginBottom: '2px' }}>
                  <Target size={12} style={{ verticalAlign: 'middle' }} /> Acción: {reporte.accionEstrategica}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Indicador: {reporte.indicador}
                </div>
              </div>
              <div style={{ textAlign: 'right', minWidth: '140px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end', marginBottom: '4px' }}>
                  <Users size={14} color="#64748b" />
                  <span style={{ fontWeight: 700, color: '#0b2240', fontSize: '0.85rem' }}>
                    {reporte.responsable?.nombre}
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  {reporte.responsable?.cargo}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '6px' }}>
                  <Calendar size={12} style={{ verticalAlign: 'middle' }} /> {reporte.fecha}
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="admin-inst-report-body">
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '12px 14px',
                marginBottom: '10px',
              }}>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#334155', lineHeight: 1.6 }}>
                  {reporte.descripcion}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  👥 {reporte.beneficiados} beneficiados
                </span>
              </div>

              {reporte.fotos && reporte.fotos.length > 0 && (
                <div className="admin-inst-report-evidence">
                  {reporte.fotos.map((foto, i) => (
                    <span key={i} className="admin-inst-evidence-tag">
                      <Image size={12} /> {foto}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            {rechazandoId !== reporte.id && (
              <div className="admin-inst-report-actions">
                <button
                  className="admin-inst-btn admin-inst-btn--aprobar"
                  onClick={() => handleAprobar(reporte.id)}
                >
                  <CheckCircle size={16} /> Aprobar ✅
                </button>
                <button
                  className="admin-inst-btn admin-inst-btn--rechazar"
                  onClick={() => {
                    setRechazandoId(reporte.id);
                    setObservacion('');
                  }}
                >
                  <XCircle size={16} /> Rechazar ❌
                </button>
              </div>
            )}

            {/* Reject area */}
            {rechazandoId === reporte.id && (
              <div className="admin-inst-reject-area">
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#991b1b', marginBottom: '6px' }}>
                  Observación (obligatoria) — ¿Qué debe corregir el responsable?
                </label>
                <textarea
                  className="admin-inst-reject-textarea"
                  value={observacion}
                  onChange={e => setObservacion(e.target.value)}
                  placeholder="Describa con detalle qué debe corregir o completar el responsable..."
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="admin-inst-btn admin-inst-btn--rechazar"
                    onClick={() => handleRechazar(reporte.id)}
                    disabled={!observacion.trim()}
                  >
                    Confirmar Rechazo
                  </button>
                  <button
                    className="admin-inst-btn admin-inst-btn--secondary"
                    onClick={() => {
                      setRechazandoId(null);
                      setObservacion('');
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default RevisionReportes;
