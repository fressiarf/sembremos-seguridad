import React, { useState, useEffect } from 'react';
import { useLogin } from '../../../context/LoginContext';
import { useToast } from '../../../context/ToastContext';
import { informesService, ESTADOS_INFORME, TRIMESTRES } from '../../../services/informesService';
import {
  FileSearch, CheckCircle, XCircle, Clock, AlertTriangle,
  ChevronDown, ChevronUp, Eye, X, Paperclip, Send, Filter
} from 'lucide-react';
import '../../Shared/InformesTrimestrales/InformesTrimestrales.css';

const RevisionInformesTrimestral = () => {
  const { user } = useLogin();
  const { showToast } = useToast();
  const [informes, setInformes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [detalleInforme, setDetalleInforme] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [showRechazo, setShowRechazo] = useState(false);
  const [comentarioRechazo, setComentarioRechazo] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    cargarInformes();
  }, [user?.institucion]);

  const cargarInformes = async () => {
    if (!user?.institucion) return;
    try {
      setLoading(true);
      const data = await informesService.getByInstitucion(user.institucion);
      // Ordenar: pendientes primero, luego por fecha
      data.sort((a, b) => {
        const orden = { PENDIENTE_ADMIN: 0, RECHAZADO: 1, APROBADO_INSTITUCIONAL: 2, BORRADOR: 3 };
        const diff = (orden[a.estado] ?? 9) - (orden[b.estado] ?? 9);
        if (diff !== 0) return diff;
        return new Date(b.fechaCreacion) - new Date(a.fechaCreacion);
      });
      setInformes(data);
    } catch (e) {
      showToast('Error al cargar informes', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ── Aprobar ──
  const aprobar = async (informe) => {
    try {
      setProcessing(true);
      await informesService.aprobar(informe.id, user.nombre, user.id);
      showToast('✅ Informe aprobado exitosamente.', 'success');
      setDetalleInforme(null);
      cargarInformes();
    } catch (e) {
      showToast('Error al aprobar', 'error');
    } finally {
      setProcessing(false);
    }
  };

  // ── Rechazar ──
  const rechazar = async (informe) => {
    if (!comentarioRechazo.trim()) {
      return showToast('Debe indicar el motivo del rechazo.', 'warning');
    }
    try {
      setProcessing(true);
      await informesService.rechazar(informe.id, user.nombre, user.id, comentarioRechazo.trim());
      showToast('Informe rechazado y devuelto al editor.', 'info');
      setShowRechazo(false);
      setComentarioRechazo('');
      setDetalleInforme(null);
      cargarInformes();
    } catch (e) {
      showToast('Error al rechazar', 'error');
    } finally {
      setProcessing(false);
    }
  };

  // ── Ver detalle ──
  const verDetalle = async (informe) => {
    setDetalleInforme(informe);
    setShowRechazo(false);
    setComentarioRechazo('');
    const hist = await informesService.getHistorial(informe.id);
    setHistorial(hist);
  };

  // ── Filtrar ──
  const informesFiltrados = informes.filter(i => {
    if (filtroEstado === 'TODOS') return true;
    return i.estado === filtroEstado;
  });

  const contadores = {
    TODOS: informes.length,
    PENDIENTE_ADMIN: informes.filter(i => i.estado === ESTADOS_INFORME.PENDIENTE_ADMIN).length,
    APROBADO_INSTITUCIONAL: informes.filter(i => i.estado === ESTADOS_INFORME.APROBADO_INSTITUCIONAL).length,
    RECHAZADO: informes.filter(i => i.estado === ESTADOS_INFORME.RECHAZADO).length,
  };

  // ── Helpers ──
  const getProgressClass = (val) => {
    if (val >= 75) return 'inf-progress-fill--high';
    if (val >= 40) return 'inf-progress-fill--mid';
    return 'inf-progress-fill--low';
  };

  const estadoClase = (estado) => ({
    BORRADOR: 'borrador', PENDIENTE_ADMIN: 'pendiente',
    RECHAZADO: 'rechazado', APROBADO_INSTITUCIONAL: 'aprobado',
  }[estado] || 'borrador');

  const estadoLabel = (estado) => ({
    BORRADOR: 'Borrador', PENDIENTE_ADMIN: 'Pendiente de Revisión',
    RECHAZADO: 'Rechazado', APROBADO_INSTITUCIONAL: 'Aprobado',
  }[estado] || estado);

  const estadoIcon = (estado) => ({
    PENDIENTE_ADMIN: <Clock size={12} />,
    RECHAZADO: <AlertTriangle size={12} />,
    APROBADO_INSTITUCIONAL: <CheckCircle size={12} />,
  }[estado] || null);

  const formatFecha = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('es-CR', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const promedioAvance = (filas) => {
    if (!filas?.length) return 0;
    return Math.round(filas.reduce((s, f) => s + (f.avance || 0), 0) / filas.length);
  };

  if (loading) return <div style={{ padding: '3rem', color: '#7a9cc4' }}>Cargando informes...</div>;

  return (
    <div className="informes-modulo">
      {/* ── Header ── */}
      <div className="informes-modulo__header">
        <h1 className="informes-modulo__title">
          <FileSearch size={24} />
          Revisión de Informes Trimestrales
        </h1>
        <p className="informes-modulo__subtitle">
          Revise, apruebe o rechace los informes trimestrales enviados por los editores de {user?.institucion || 'su institución'}.
        </p>
      </div>

      {/* ── Stats ── */}
      <div className="inf-stats-row">
        <div className="inf-stat-card" style={{ borderLeftColor: '#3b82f6' }}>
          <div className="inf-stat-card__label"><FileSearch size={15} color="#3b82f6" /> Total</div>
          <div className="inf-stat-card__value">{contadores.TODOS}</div>
        </div>
        <div className="inf-stat-card" style={{ borderLeftColor: '#d97706' }}>
          <div className="inf-stat-card__label"><Clock size={15} color="#d97706" /> Pendientes</div>
          <div className="inf-stat-card__value">{contadores.PENDIENTE_ADMIN}</div>
        </div>
        <div className="inf-stat-card" style={{ borderLeftColor: '#059669' }}>
          <div className="inf-stat-card__label"><CheckCircle size={15} color="#059669" /> Aprobados</div>
          <div className="inf-stat-card__value">{contadores.APROBADO_INSTITUCIONAL}</div>
        </div>
        <div className="inf-stat-card" style={{ borderLeftColor: '#dc2626' }}>
          <div className="inf-stat-card__label"><AlertTriangle size={15} color="#dc2626" /> Rechazados</div>
          <div className="inf-stat-card__value">{contadores.RECHAZADO}</div>
        </div>
      </div>

      {/* ── Filtros ── */}
      <div className="informes-modulo__controls">
        <Filter size={16} color="#64748b" />
        <div className="inf-chips">
          {[
            { key: 'TODOS', label: 'Todos' },
            { key: 'PENDIENTE_ADMIN', label: 'Pendientes' },
            { key: 'APROBADO_INSTITUCIONAL', label: 'Aprobados' },
            { key: 'RECHAZADO', label: 'Rechazados' },
          ].map(f => (
            <button
              key={f.key}
              className={`inf-chip ${filtroEstado === f.key ? 'inf-chip--active' : ''}`}
              onClick={() => setFiltroEstado(f.key)}
            >
              {f.label} ({contadores[f.key] || 0})
            </button>
          ))}
        </div>
      </div>

      {/* ── Lista de informes ── */}
      {informesFiltrados.length === 0 ? (
        <div className="inf-empty">
          <div className="inf-empty__icon">📋</div>
          <div className="inf-empty__text">No hay informes {filtroEstado !== 'TODOS' ? 'con este filtro' : ''}</div>
          <div className="inf-empty__sub">Los informes enviados por editores aparecerán aquí.</div>
        </div>
      ) : (
        <div className="inf-cards-grid">
          {informesFiltrados.map(inf => (
            <div
              key={inf.id}
              className={`inf-card inf-card--${estadoClase(inf.estado)}`}
              onClick={() => verDetalle(inf)}
            >
              <div className="inf-card__header">
                <div>
                  <div className="inf-card__inst">{inf.editorNombre}</div>
                  <div className="inf-card__trimestre">
                    {TRIMESTRES.find(t => t.value === inf.trimestre)?.label || inf.trimestre}
                  </div>
                </div>
                <span className={`inf-estado-badge inf-estado-badge--${estadoClase(inf.estado)}`}>
                  {estadoIcon(inf.estado)}
                  {estadoLabel(inf.estado)}
                </span>
              </div>

              {/* Resumen rápido de filas */}
              <div className="inf-filas-resumen">
                {inf.filas?.slice(0, 3).map((f, i) => (
                  <div key={i} className="inf-fila-resumen-item">
                    <span className="inf-fila-tag">{f.lineaEstrategica}</span>
                    <div className="inf-progress-cell" style={{ flex: 1 }}>
                      <div className="inf-progress-bar">
                        <div className={`inf-progress-fill ${getProgressClass(f.avance)}`} style={{ width: `${f.avance}%` }} />
                      </div>
                      <span className="inf-progress-label">{f.avance}%</span>
                    </div>
                  </div>
                ))}
                {inf.filas?.length > 3 && (
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', paddingTop: '4px' }}>
                    +{inf.filas.length - 3} más...
                  </div>
                )}
              </div>

              <div className="inf-card__meta">
                <div className="inf-card__meta-item">
                  <span className="inf-card__meta-label">Filas</span>
                  <span className="inf-card__meta-value">{inf.filas?.length || 0}</span>
                </div>
                <div className="inf-card__meta-item">
                  <span className="inf-card__meta-label">Avance Prom.</span>
                  <span className="inf-card__meta-value">{promedioAvance(inf.filas)}%</span>
                </div>
                <div className="inf-card__meta-item">
                  <span className="inf-card__meta-label">Enviado</span>
                  <span className="inf-card__meta-value" style={{ fontSize: '0.72rem' }}>
                    {formatFecha(inf.fechaEnvio)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal de detalle ── */}
      {detalleInforme && (
        <div className="inf-modal-overlay" onClick={() => setDetalleInforme(null)}>
          <div className="inf-modal" onClick={(e) => e.stopPropagation()}>
            <div className="inf-modal__header">
              <div>
                <div className="inf-modal__title">Revisión: {detalleInforme.editorNombre}</div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '4px' }}>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    {TRIMESTRES.find(t => t.value === detalleInforme.trimestre)?.label}
                  </span>
                  <span className={`inf-estado-badge inf-estado-badge--${estadoClase(detalleInforme.estado)}`}>
                    {estadoIcon(detalleInforme.estado)}
                    {estadoLabel(detalleInforme.estado)}
                  </span>
                </div>
              </div>
              <button className="inf-btn inf-btn--ghost inf-btn--icon-only" onClick={() => setDetalleInforme(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="inf-modal__body">
              {/* Tabla completa del informe */}
              <div className="inf-tabla-wrap">
                <table className="inf-tabla">
                  <thead>
                    <tr>
                      <th>Línea Estratégica</th>
                      <th>Actividad / Tarea</th>
                      <th>Indicador</th>
                      <th>% Avance</th>
                      <th>Evidencias</th>
                      <th>Observaciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detalleInforme.filas?.map((f, i) => (
                      <tr key={i}>
                        <td><span className="inf-fila-tag">{f.lineaEstrategica}</span></td>
                        <td style={{ fontSize: '0.78rem' }}>{f.actividad}</td>
                        <td style={{ fontSize: '0.78rem' }}>{f.indicador || '—'}</td>
                        <td>
                          <div className="inf-progress-cell">
                            <div className="inf-progress-bar">
                              <div className={`inf-progress-fill ${getProgressClass(f.avance)}`} style={{ width: `${f.avance}%` }} />
                            </div>
                            <span className="inf-progress-label">{f.avance}%</span>
                          </div>
                        </td>
                        <td>
                          {f.evidencias?.length > 0 ? f.evidencias.map((ev, j) => (
                            <span key={j} className="inf-file-tag" style={{ display: 'inline-flex', margin: '2px' }}>
                              <Paperclip size={10} /> {ev.length > 18 ? ev.slice(0, 16) + '…' : ev}
                            </span>
                          )) : <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>—</span>}
                        </td>
                        <td style={{ fontSize: '0.78rem', color: '#475569' }}>{f.observaciones || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Zona de rechazo */}
              {showRechazo && (
                <div style={{
                  background: '#fef2f2', border: '1px solid #fecaca',
                  borderRadius: '10px', padding: '1rem', marginTop: '1rem'
                }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#991b1b', display: 'block', marginBottom: '6px' }}>
                    Motivo del Rechazo *
                  </label>
                  <textarea
                    className="inf-rechazo-area"
                    placeholder="Indique los motivos del rechazo y las correcciones necesarias..."
                    value={comentarioRechazo}
                    onChange={(e) => setComentarioRechazo(e.target.value)}
                  />
                </div>
              )}

              {/* Historial de estados */}
              {historial.length > 0 && (
                <div style={{ marginTop: '1.25rem' }}>
                  <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
                    Historial de Estados
                  </h3>
                  <div className="inf-historial">
                    {historial.map((h, i) => (
                      <div key={i} className="inf-historial__item">
                        <div className="inf-historial__accion">{h.accion}</div>
                        <div className="inf-historial__detalle">{h.detalle} — {h.usuario}</div>
                        <div className="inf-historial__fecha">{formatFecha(h.fecha)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer: Acciones de aprobación/rechazo */}
            {detalleInforme.estado === ESTADOS_INFORME.PENDIENTE_ADMIN && (
              <div className="inf-modal__footer">
                {!showRechazo ? (
                  <>
                    <button className="inf-btn inf-btn--ghost" onClick={() => setDetalleInforme(null)}>Cerrar</button>
                    <button
                      className="inf-btn inf-btn--danger"
                      onClick={() => setShowRechazo(true)}
                    >
                      <XCircle size={15} /> Rechazar
                    </button>
                    <button
                      className="inf-btn inf-btn--success"
                      onClick={() => aprobar(detalleInforme)}
                      disabled={processing}
                    >
                      <CheckCircle size={15} /> {processing ? 'Aprobando…' : 'Aprobar'}
                    </button>
                  </>
                ) : (
                  <>
                    <button className="inf-btn inf-btn--ghost" onClick={() => { setShowRechazo(false); setComentarioRechazo(''); }}>
                      Cancelar
                    </button>
                    <button
                      className="inf-btn inf-btn--danger"
                      onClick={() => rechazar(detalleInforme)}
                      disabled={processing || !comentarioRechazo.trim()}
                    >
                      <Send size={15} /> {processing ? 'Enviando…' : 'Confirmar Rechazo'}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RevisionInformesTrimestral;
