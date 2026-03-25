import React, { useState, useEffect } from 'react';
import { adminInstitucionService } from '../../../services/adminInstitucionService';
import { useToast } from '../../../context/ToastContext';
import { FileSearch, CheckCircle, XCircle, Users, Calendar, Target, Activity, Image as ImageIcon, ChevronDown, ChevronUp, Edit3, Save, MapPin } from 'lucide-react';
import '../AdminInstitucion.css';

const LINEAS_ACCION_INFO = [
  { id: 'linea-1', numero: 1, nombre: 'Consumo de drogas' },
  { id: 'linea-2', numero: 2, nombre: 'Violencia intrafamiliar y de género' },
  { id: 'linea-3', numero: 3, nombre: 'Personas en sit. de calle' },
  { id: 'linea-4', numero: 4, nombre: 'Falta de inversión social' },
];

const RevisionReportes = () => {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rechazandoId, setRechazandoId] = useState(null);
  const [observacion, setObservacion] = useState('');
  
  // Edit mode state
  const [editandoId, setEditandoId] = useState(null);
  const [editForm, setEditForm] = useState({ descripcion: '', beneficiados: 0 });

  const [lineasExpandidas, setLineasExpandidas] = useState({});
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

  // Edición
  const handleIniciarEdicion = (reporte) => {
    setRechazandoId(null); // Close reject form if open
    setEditandoId(reporte.id);
    setEditForm({ descripcion: reporte.descripcion, beneficiados: reporte.beneficiados });
  };

  const handleGuardarEdicion = async (reporteId) => {
    if (!editForm.descripcion.trim()) {
      showToast('La descripción no puede estar vacía', 'warning');
      return;
    }
    try {
      const result = await adminInstitucionService.editarReporte(reporteId, editForm);
      if (result.success) {
        showToast('Reporte editado correctamente 📝', 'success');
        setEditandoId(null);
        loadReportes();
      }
    } catch (e) {
      showToast('Error al editar el reporte', 'error');
    }
  };

  const toggleLinea = (id) => {
    setLineasExpandidas(prev => ({...prev, [id]: !prev[id]}));
  };

  if (loading) return <div style={{ padding: '3rem', color: '#7a9cc4' }}>Cargando reportes...</div>;

  return (
    <div style={{ padding: '2rem 2.5rem', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: '0 0 4px', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
          Revisión de Reportes
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', margin: 0, textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
          Revisa, edita, aprueba o rechaza los reportes subidos por tus responsables.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {LINEAS_ACCION_INFO.map(linea => {
          const reportesLinea = reportes.filter(r => r.tarea?.lineaId === linea.id);
          const isExpanded = lineasExpandidas[linea.id];

          return (
            <div key={linea.id} className="admin-inst-stat-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div 
                style={{ 
                  padding: '1rem 1.25rem', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  cursor: 'pointer',
                  background: isExpanded ? '#f8fafc' : '#fff',
                  borderBottom: isExpanded ? '1px solid #e2e8f0' : 'none',
                  transition: 'background 0.2s'
                }}
                onClick={() => toggleLinea(linea.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ padding: '8px', background: '#e0e7ff', color: '#4f46e5', borderRadius: '8px' }}>
                    <FileSearch size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a', fontWeight: 700 }}>
                      Línea #{linea.numero} — {linea.nombre}
                    </h3>
                    <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                      {reportesLinea.length} reportes pendientes
                    </p>
                  </div>
                </div>
                <div style={{ color: '#94a3b8' }}>
                  {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </div>
              </div>

              {isExpanded && (
                <div style={{ padding: '1.25rem', background: '#fff' }}>
                  {reportesLinea.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                      <CheckCircle size={32} style={{ opacity: 0.5, marginBottom: '8px' }} />
                      <p style={{ margin: 0, fontSize: '0.9rem' }}>No hay reportes pendientes de revisión.</p>
                    </div>
                  ) : (
                    reportesLinea.map(reporte => (
                      <div key={reporte.id} className="admin-inst-report-card">
                        {/* Header */}
                        <div className="admin-inst-report-header">
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                              <span className="admin-inst-badge admin-inst-badge--pendiente">Pendiente</span>
                              {reporte.editadoPorAdmin && (
                                <span className="admin-inst-badge admin-inst-badge--aprobado" style={{background: '#e0f2fe', color: '#1d4ed8'}}>
                                  Editado por Institución
                                </span>
                              )}
                            </div>
                            <h3 style={{ margin: '0 0 4px', fontSize: '1.05rem', fontWeight: 700, color: '#0b2240' }}>
                              {reporte.tarea?.titulo}
                            </h3>
                            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, marginBottom: '2px' }}>
                              <MapPin size={12} style={{ verticalAlign: 'middle' }} /> Lugar de ejecución: {reporte.tarea?.zona || 'No especificado'}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                              Indicador a cumplir: {reporte.indicador}
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
                              <Calendar size={12} style={{ verticalAlign: 'middle' }} /> Creado: {reporte.fecha}
                            </div>
                          </div>
                        </div>

                        {/* Body - Edit/View Mode */}
                        <div className="admin-inst-report-body">
                          {editandoId === reporte.id ? (
                            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                                Editar Descripción del Reporte
                              </label>
                              <textarea
                                value={editForm.descripcion}
                                onChange={e => setEditForm({...editForm, descripcion: e.target.value})}
                                style={{ width: '100%', minHeight: '100px', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.88rem', fontFamily: 'Inter, sans-serif', marginBottom: '12px' }}
                              />
                              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                                Cantidad de Beneficiados
                              </label>
                              <input
                                type="number"
                                value={editForm.beneficiados}
                                onChange={e => setEditForm({...editForm, beneficiados: parseInt(e.target.value) || 0})}
                                style={{ width: '150px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.88rem', fontFamily: 'Inter, sans-serif', marginBottom: '12px' }}
                              />
                              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                                <button 
                                  className="admin-inst-btn admin-inst-btn--aprobar" 
                                  onClick={() => handleGuardarEdicion(reporte.id)}
                                >
                                  <Save size={16} /> Guardar Cambios
                                </button>
                                <button 
                                  className="admin-inst-btn admin-inst-btn--secondary" 
                                  onClick={() => setEditandoId(null)}
                                >
                                  Cancelar
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
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

                              <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '12px',
                                marginTop: '12px',
                                marginBottom: '12px'
                              }}>
                                {/* Asistentes */}
                                <div style={{ background: '#f1f5f9', padding: '10px 12px', borderRadius: '6px' }}>
                                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>POBLACIÓN BENEFICIADA</div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#0b2240', marginBottom: '6px' }}>
                                    <Users size={14} color="#3b82f6" /> {reporte.beneficiados} total
                                  </div>
                                  {reporte.asistentes ? (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '0.75rem', color: '#475569' }}>
                                      <div><span style={{color: '#94a3b8'}}>Niñez:</span> <b>{reporte.asistentes.ninos || 0}</b></div>
                                      <div><span style={{color: '#94a3b8'}}>Adolesc.:</span> <b>{reporte.asistentes.adolescentes || 0}</b></div>
                                      <div><span style={{color: '#94a3b8'}}>Juventud:</span> <b>{reporte.asistentes.jovenes || 0}</b></div>
                                      <div><span style={{color: '#94a3b8'}}>Adultos:</span> <b>{reporte.asistentes.adultos || 0}</b></div>
                                      <div><span style={{color: '#94a3b8'}}>Adulto M.:</span> <b>{reporte.asistentes.adultoMayor || 0}</b></div>
                                    </div>
                                  ) : null}
                                </div>
                                
                                {/* Detalles de actividad e Inversión */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                  {reporte.tipoActividad && (
                                    <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '8px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <Target size={14} color="#2563eb" />
                                      <div>
                                        <div style={{ fontSize: '0.7rem', color: '#3b82f6', fontWeight: 700 }}>TIPO ACTIVIDAD</div>
                                        <div style={{ fontSize: '0.8rem', color: '#1e3a8a', fontWeight: 600 }}>{reporte.tipoActividad}</div>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {reporte.inversionColones !== undefined && reporte.inversionColones > 0 && (
                                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '8px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <Activity size={14} color="#16a34a" />
                                      <div>
                                        <div style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 700 }}>INVERSIÓN Y RECURSOS</div>
                                        <div style={{ fontSize: '0.8rem', color: '#14532d', fontWeight: 600 }}>
                                          ₡{reporte.inversionColones.toLocaleString()}
                                        </div>
                                        {reporte.detalleRecursos && (
                                          <div style={{ fontSize: '0.7rem', color: '#166534', marginTop: '2px' }}>{reporte.detalleRecursos}</div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {reporte.observaciones && (
                                <div style={{ background: '#fffbeb', borderLeft: '3px solid #f59e0b', padding: '8px 12px', marginBottom: '12px', borderRadius: '0 6px 6px 0' }}>
                                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b45309', marginBottom: '2px' }}>OBSERVACIONES ADICIONALES</div>
                                  <div style={{ fontSize: '0.8rem', color: '#92400e', lineHeight: 1.4 }}>{reporte.observaciones}</div>
                                </div>
                              )}

                              {reporte.fotos && reporte.fotos.length > 0 && (
                                <div className="admin-inst-report-evidence">
                                  {reporte.fotos.map((foto, i) => (
                                    <span key={i} className="admin-inst-evidence-tag">
                                      <ImageIcon size={12} /> {foto}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </>
                          )}
                        </div>

                        {/* Actions */}
                        {rechazandoId !== reporte.id && editandoId !== reporte.id && (
                          <div className="admin-inst-report-actions">
                            <button
                              className="admin-inst-btn admin-inst-btn--aprobar"
                              onClick={() => handleAprobar(reporte.id)}
                              title="Aprobar y enviar al Administrador Global"
                            >
                              <CheckCircle size={16} /> Aprobar ✅
                            </button>
                            <button
                              className="admin-inst-btn admin-inst-btn--secondary"
                              onClick={() => handleIniciarEdicion(reporte)}
                              style={{ marginLeft: '10px' }}
                              title="Modificar los textos del reporte antes de enviarlo"
                            >
                              <Edit3 size={16} /> Editar
                            </button>
                            <div style={{ flex: 1 }}></div>
                            <button
                              className="admin-inst-btn admin-inst-btn--rechazar"
                              onClick={() => {
                                setEditandoId(null);
                                setRechazandoId(reporte.id);
                                setObservacion('');
                              }}
                              title="Devolver al responsable para que lo corrija"
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
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RevisionReportes;
