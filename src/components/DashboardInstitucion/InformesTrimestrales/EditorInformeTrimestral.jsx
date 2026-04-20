import React, { useState, useEffect, useRef } from 'react';
import { useLogin } from '../../../context/LoginContext';
import { useToast } from '../../../context/ToastContext';
import { informesService, ESTADOS_INFORME, LINEAS_ESTRATEGICAS, TRIMESTRES } from '../../../services/informesService';
import { Plus, Send, Trash2, Upload, FileText, Paperclip, X, Clock, CheckCircle, AlertTriangle, Eye, ChevronDown, RefreshCw } from 'lucide-react';
import '../../Shared/InformesTrimestrales/InformesTrimestrales.css';

// ── Fila vacía inicial ──
const crearFilaVacia = () => ({
  id: `fila-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  lineaEstrategica: '',
  actividad: '',
  indicador: '',
  avance: 0,
  evidencias: [],
  observaciones: '',
});

const EditorInformeTrimestral = () => {
  const { user } = useLogin();
  const { showToast } = useToast();
  const [trimestre, setTrimestre] = useState(TRIMESTRES[0].value);
  const [filas, setFilas] = useState([crearFilaVacia()]);
  const [informes, setInformes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [vistaDetalle, setVistaDetalle] = useState(null);
  const [historial, setHistorial] = useState([]);
  const fileRefs = useRef({});

  // ── Cargar datos ──
  useEffect(() => {
    cargarInformes();
  }, [user?.id]);

  const cargarInformes = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const data = await informesService.getByEditor(user.id);
      setInformes(data);
    } catch (e) {
      showToast('Error al cargar informes', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ── Manipulación de filas ──
  const agregarFila = () => setFilas(prev => [...prev, crearFilaVacia()]);

  const eliminarFila = (id) => {
    if (filas.length <= 1) return showToast('Debe haber al menos una fila', 'warning');
    setFilas(prev => prev.filter(f => f.id !== id));
  };

  const actualizarFila = (id, campo, valor) => {
    setFilas(prev => prev.map(f => f.id === id ? { ...f, [campo]: valor } : f));
  };

  const handleFileChange = (filaId, e) => {
    const files = Array.from(e.target.files);
    const nombres = files.map(f => f.name);
    setFilas(prev => prev.map(f =>
      f.id === filaId ? { ...f, evidencias: [...f.evidencias, ...nombres] } : f
    ));
  };

  const eliminarEvidencia = (filaId, nombre) => {
    setFilas(prev => prev.map(f =>
      f.id === filaId ? { ...f, evidencias: f.evidencias.filter(e => e !== nombre) } : f
    ));
  };

  // ── Enviar informe ──
  const enviarInforme = async () => {
    // Validaciones
    const filasValidas = filas.filter(f => f.lineaEstrategica && f.actividad);
    if (filasValidas.length === 0) {
      return showToast('Complete al menos una fila con línea estratégica y actividad.', 'warning');
    }

    try {
      setSending(true);
      const nuevoInforme = {
        id: `INF-${Date.now().toString(36)}`,
        trimestre,
        institucion: user.institucion,
        editorId: user.id,
        editorNombre: user.nombre,
        filas: filasValidas,
        estado: ESTADOS_INFORME.BORRADOR,
        fechaCreacion: new Date().toISOString(),
        fechaEnvio: null,
        fechaAprobacion: null,
        fechaRechazo: null,
        comentarioRechazo: null,
        aprobadoPor: null,
      };

      const creado = await informesService.crear(nuevoInforme);
      await informesService.enviar(creado.id, user.id, user.nombre);

      showToast('✅ Informe enviado correctamente.', 'success');
      setFilas([crearFilaVacia()]);
      cargarInformes();
    } catch (e) {
      showToast('Error al enviar el informe', 'error');
    } finally {
      setSending(false);
    }
  };

  // ── Reenviar informe rechazado ──
  const reenviarInforme = async (informe) => {
    try {
      setSending(true);
      await informesService.reenviar(informe.id, informe.filas, user.id, user.nombre);
      showToast('✅ Informe reenviado correctamente.', 'success');
      setVistaDetalle(null);
      cargarInformes();
    } catch (e) {
      showToast('Error al reenviar', 'error');
    } finally {
      setSending(false);
    }
  };

  // ── Ver historial ──
  const verDetalle = async (informe) => {
    setVistaDetalle(informe);
    const hist = await informesService.getHistorial(informe.id);
    setHistorial(hist);
  };

  // ── Helpers ──
  const getProgressClass = (val) => {
    if (val >= 75) return 'inf-progress-fill--high';
    if (val >= 40) return 'inf-progress-fill--mid';
    return 'inf-progress-fill--low';
  };

  const estadoClase = (estado) => {
    const map = {
      [ESTADOS_INFORME.BORRADOR]: 'borrador',
      [ESTADOS_INFORME.PENDIENTE_ADMIN]: 'pendiente',
      [ESTADOS_INFORME.RECHAZADO]: 'rechazado',
      [ESTADOS_INFORME.APROBADO_INSTITUCIONAL]: 'aprobado',
    };
    return map[estado] || 'borrador';
  };

  const estadoLabel = (estado) => {
    const map = {
      [ESTADOS_INFORME.BORRADOR]: 'Borrador',
      [ESTADOS_INFORME.PENDIENTE_ADMIN]: 'Pendiente',
      [ESTADOS_INFORME.RECHAZADO]: 'Rechazado',
      [ESTADOS_INFORME.APROBADO_INSTITUCIONAL]: 'Aprobado',
    };
    return map[estado] || estado;
  };

  const estadoIcon = (estado) => {
    const map = {
      [ESTADOS_INFORME.BORRADOR]: <FileText size={12} />,
      [ESTADOS_INFORME.PENDIENTE_ADMIN]: <Clock size={12} />,
      [ESTADOS_INFORME.RECHAZADO]: <AlertTriangle size={12} />,
      [ESTADOS_INFORME.APROBADO_INSTITUCIONAL]: <CheckCircle size={12} />,
    };
    return map[estado] || null;
  };

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
          <FileText size={24} />
          Informes Trimestrales de Avance
        </h1>
        <p className="informes-modulo__subtitle">
          Cree y envíe su informe trimestral de actividades. Complete la tabla con las actividades realizadas.
        </p>
      </div>

      {/* ── Selector de trimestre ── */}
      <div className="informes-modulo__controls">
        <select
          className="informes-modulo__select"
          value={trimestre}
          onChange={(e) => setTrimestre(e.target.value)}
        >
          {TRIMESTRES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>

        <button className="inf-btn inf-btn--primary" onClick={agregarFila}>
          <Plus size={16} />
          Agregar Fila
        </button>
      </div>

      {/* ── Tabla dinámica ── */}
      <div className="inf-tabla-wrap">
        <table className="inf-tabla">
          <thead>
            <tr>
              <th style={{ width: '20%' }}>Línea Estratégica</th>
              <th style={{ width: '22%' }}>Actividad / Tarea</th>
              <th style={{ width: '16%' }}>Indicador de Cumplimiento</th>
              <th style={{ width: '10%' }}>% Avance</th>
              <th style={{ width: '14%' }}>Evidencia</th>
              <th style={{ width: '14%' }}>Observaciones</th>
              <th style={{ width: '4%' }}></th>
            </tr>
          </thead>
          <tbody>
            {filas.map((fila, idx) => (
              <tr key={fila.id}>
                <td>
                  <select
                    value={fila.lineaEstrategica}
                    onChange={(e) => actualizarFila(fila.id, 'lineaEstrategica', e.target.value)}
                  >
                    <option value="">Seleccionar…</option>
                    {LINEAS_ESTRATEGICAS.map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <textarea
                    placeholder="Describe la actividad realizada..."
                    value={fila.actividad}
                    onChange={(e) => actualizarFila(fila.id, 'actividad', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Ej: 3 charlas ejecutadas"
                    value={fila.indicador}
                    onChange={(e) => actualizarFila(fila.id, 'indicador', e.target.value)}
                  />
                </td>
                <td>
                  <div className="inf-progress-cell">
                    <input
                      type="number"
                      className="inf-avance-input"
                      min="0"
                      max="100"
                      value={fila.avance}
                      onChange={(e) => actualizarFila(fila.id, 'avance', Math.min(100, Math.max(0, Number(e.target.value))))}
                    />
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label className="inf-upload-btn">
                      <Upload size={14} />
                      Subir archivo
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        multiple
                        onChange={(e) => handleFileChange(fila.id, e)}
                        ref={el => fileRefs.current[fila.id] = el}
                      />
                    </label>
                    {fila.evidencias.map((ev, i) => (
                      <span key={i} className="inf-file-tag">
                        <Paperclip size={10} />
                        {ev.length > 20 ? ev.slice(0, 18) + '…' : ev}
                        <button onClick={() => eliminarEvidencia(fila.id, ev)}>×</button>
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <textarea
                    placeholder="Observaciones o limitaciones..."
                    value={fila.observaciones}
                    onChange={(e) => actualizarFila(fila.id, 'observaciones', e.target.value)}
                    style={{ minHeight: '44px' }}
                  />
                </td>
                <td>
                  <button
                    className="inf-btn inf-btn--ghost inf-btn--icon-only"
                    onClick={() => eliminarFila(fila.id)}
                    title="Eliminar fila"
                  >
                    <Trash2 size={15} color="#dc2626" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="inf-tabla-footer">
          <span style={{ color: '#64748b', fontSize: '0.78rem' }}>
            {filas.length} fila{filas.length !== 1 ? 's' : ''} • Trimestre: {TRIMESTRES.find(t => t.value === trimestre)?.label}
          </span>
          <button
            className="inf-btn inf-btn--success"
            onClick={enviarInforme}
            disabled={sending}
          >
            <Send size={15} />
            {sending ? 'Enviando…' : 'Enviar Informe'}
          </button>
        </div>
      </div>

      {/* ── Mis informes enviados ── */}
      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
          Mis Informes Enviados
        </h2>

        {informes.length === 0 ? (
          <div className="inf-empty">
            <div className="inf-empty__icon">📋</div>
            <div className="inf-empty__text">Aún no has enviado informes</div>
            <div className="inf-empty__sub">Completa la tabla de arriba y envía tu primer informe trimestral.</div>
          </div>
        ) : (
          <div className="inf-cards-grid">
            {informes.map(inf => (
              <div
                key={inf.id}
                className={`inf-card inf-card--${estadoClase(inf.estado)}`}
                onClick={() => verDetalle(inf)}
              >
                <div className="inf-card__header">
                  <div>
                    <div className="inf-card__inst">{inf.institucion}</div>
                    <div className="inf-card__trimestre">
                      {TRIMESTRES.find(t => t.value === inf.trimestre)?.label || inf.trimestre}
                    </div>
                  </div>
                  <span className={`inf-estado-badge inf-estado-badge--${estadoClase(inf.estado)}`}>
                    {estadoIcon(inf.estado)}
                    {estadoLabel(inf.estado)}
                  </span>
                </div>

                {inf.comentarioRechazo && (
                  <div style={{
                    background: '#fef2f2', border: '1px solid #fecaca',
                    borderRadius: '8px', padding: '0.5rem 0.75rem',
                    fontSize: '0.75rem', color: '#dc2626', marginBottom: '0.5rem'
                  }}>
                    <strong>Motivo rechazo:</strong> {inf.comentarioRechazo}
                  </div>
                )}

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
                    <span className="inf-card__meta-value" style={{ fontSize: '0.75rem' }}>
                      {formatFecha(inf.fechaEnvio)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Modal de detalle ── */}
      {vistaDetalle && (
        <div className="inf-modal-overlay" onClick={() => setVistaDetalle(null)}>
          <div className="inf-modal" onClick={(e) => e.stopPropagation()}>
            <div className="inf-modal__header">
              <div>
                <div className="inf-modal__title">Detalle del Informe</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                  {TRIMESTRES.find(t => t.value === vistaDetalle.trimestre)?.label}
                  {' · '}
                  <span className={`inf-estado-badge inf-estado-badge--${estadoClase(vistaDetalle.estado)}`}>
                    {estadoIcon(vistaDetalle.estado)}
                    {estadoLabel(vistaDetalle.estado)}
                  </span>
                </div>
              </div>
              <button className="inf-btn inf-btn--ghost inf-btn--icon-only" onClick={() => setVistaDetalle(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="inf-modal__body">
              {/* Comentario de rechazo */}
              {vistaDetalle.comentarioRechazo && (
                <div style={{
                  background: '#fef2f2', border: '1px solid #fecaca',
                  borderRadius: '10px', padding: '0.85rem 1rem',
                  fontSize: '0.82rem', color: '#991b1b', marginBottom: '1rem'
                }}>
                  <div style={{ fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertTriangle size={14} /> Motivo del Rechazo
                  </div>
                  {vistaDetalle.comentarioRechazo}
                </div>
              )}

              {/* Tabla de filas (solo lectura) */}
              <div className="inf-tabla-wrap">
                <table className="inf-tabla">
                  <thead>
                    <tr>
                      <th>Línea Estratégica</th>
                      <th>Actividad</th>
                      <th>Indicador</th>
                      <th>% Avance</th>
                      <th>Evidencias</th>
                      <th>Observaciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vistaDetalle.filas?.map((f, i) => (
                      <tr key={i}>
                        <td><span className="inf-fila-tag">{f.lineaEstrategica}</span></td>
                        <td style={{ fontSize: '0.78rem' }}>{f.actividad}</td>
                        <td style={{ fontSize: '0.78rem' }}>{f.indicador || '—'}</td>
                        <td>
                          <div className="inf-progress-cell">
                            <div className="inf-progress-bar">
                              <div
                                className={`inf-progress-fill ${getProgressClass(f.avance)}`}
                                style={{ width: `${f.avance}%` }}
                              />
                            </div>
                            <span className="inf-progress-label">{f.avance}%</span>
                          </div>
                        </td>
                        <td>
                          {f.evidencias?.length > 0 ? f.evidencias.map((ev, j) => (
                            <span key={j} className="inf-file-tag">
                              <Paperclip size={10} /> {ev.length > 18 ? ev.slice(0, 16) + '…' : ev}
                            </span>
                          )) : <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Sin evidencia</span>}
                        </td>
                        <td style={{ fontSize: '0.78rem', color: '#475569' }}>{f.observaciones || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

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

            {/* Footer con opción de reenvío para rechazados */}
            {vistaDetalle.estado === ESTADOS_INFORME.RECHAZADO && (
              <div className="inf-modal__footer">
                <button className="inf-btn inf-btn--ghost" onClick={() => setVistaDetalle(null)}>
                  Cerrar
                </button>
                <button
                  className="inf-btn inf-btn--warning"
                  onClick={() => reenviarInforme(vistaDetalle)}
                  disabled={sending}
                >
                  <RefreshCw size={15} />
                  {sending ? 'Reenviando…' : 'Corregir y Reenviar'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorInformeTrimestral;
