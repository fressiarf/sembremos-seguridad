import React, { useState, useEffect, useRef } from 'react';
import { useLogin } from '../../../context/LoginContext';
import { useToast } from '../../../context/ToastContext';
import { informesService, TRIMESTRES, LINEAS_ESTRATEGICAS } from '../../../services/informesService';
import {
  BarChart3, FileText, Building2, TrendingUp, Download,
  Filter, Eye, X, Paperclip, CheckCircle, ChevronDown
} from 'lucide-react';
import '../../Shared/InformesTrimestrales/InformesTrimestrales.css';

const ConsolidadoTrimestral = () => {
  const { user } = useLogin();
  const { showToast } = useToast();
  const [informes, setInformes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroTrimestre, setFiltroTrimestre] = useState('TODOS');
  const [filtroInstitucion, setFiltroInstitucion] = useState('TODOS');
  const [detalleInforme, setDetalleInforme] = useState(null);
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    cargarInformes();
  }, []);

  const cargarInformes = async () => {
    try {
      setLoading(true);
      const data = await informesService.getAprobados();
      data.sort((a, b) => new Date(b.fechaAprobacion) - new Date(a.fechaAprobacion));
      setInformes(data);
    } catch (e) {
      showToast('Error al cargar informes consolidados', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ── Filtrado ──
  const instituciones = [...new Set(informes.map(i => i.institucion))];

  const informesFiltrados = informes.filter(i => {
    if (filtroTrimestre !== 'TODOS' && i.trimestre !== filtroTrimestre) return false;
    if (filtroInstitucion !== 'TODOS' && i.institucion !== filtroInstitucion) return false;
    return true;
  });

  // ── Estadísticas ──
  const todasFilas = informesFiltrados.flatMap(i => i.filas || []);
  const promedioGeneral = todasFilas.length > 0
    ? Math.round(todasFilas.reduce((s, f) => s + (f.avance || 0), 0) / todasFilas.length)
    : 0;

  const porLinea = LINEAS_ESTRATEGICAS.map(linea => {
    const filasLinea = todasFilas.filter(f => f.lineaEstrategica === linea);
    const promedio = filasLinea.length > 0
      ? Math.round(filasLinea.reduce((s, f) => s + (f.avance || 0), 0) / filasLinea.length)
      : 0;
    return { linea, promedio, actividades: filasLinea.length };
  }).filter(l => l.actividades > 0).sort((a, b) => b.promedio - a.promedio);

  const porInstitucion = instituciones.map(inst => {
    const informesInst = informesFiltrados.filter(i => i.institucion === inst);
    const filasInst = informesInst.flatMap(i => i.filas || []);
    const promedio = filasInst.length > 0
      ? Math.round(filasInst.reduce((s, f) => s + (f.avance || 0), 0) / filasInst.length)
      : 0;
    return { institucion: inst, informes: informesInst.length, actividades: filasInst.length, promedio };
  }).sort((a, b) => b.promedio - a.promedio);

  // ── Helpers ──
  const getProgressClass = (val) => {
    if (val >= 75) return 'inf-progress-fill--high';
    if (val >= 40) return 'inf-progress-fill--mid';
    return 'inf-progress-fill--low';
  };

  const getProgressColor = (val) => {
    if (val >= 75) return '#059669';
    if (val >= 40) return '#d97706';
    return '#dc2626';
  };

  const formatFecha = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('es-CR', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  const promedioAvance = (filas) => {
    if (!filas?.length) return 0;
    return Math.round(filas.reduce((s, f) => s + (f.avance || 0), 0) / filas.length);
  };

  // ── Generar PDF (resumen) ──
  const generarPDF = () => {
    const win = window.open('', '_blank');
    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Consolidado Trimestral - Sembremos Seguridad</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; padding: 2rem; }
          .header { text-align: center; margin-bottom: 2rem; border-bottom: 3px solid #002f6c; padding-bottom: 1rem; }
          .header h1 { font-size: 1.4rem; color: #002f6c; }
          .header p { color: #64748b; font-size: 0.85rem; margin-top: 4px; }
          .stats { display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
          .stat { flex: 1; min-width: 140px; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.75rem; text-align: center; }
          .stat-label { font-size: 0.7rem; color: #64748b; text-transform: uppercase; font-weight: 600; }
          .stat-value { font-size: 1.5rem; font-weight: 800; color: #0f172a; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; font-size: 0.8rem; }
          th { background: #002f6c; color: #fff; padding: 0.65rem 0.75rem; text-align: left; font-size: 0.72rem; text-transform: uppercase; }
          td { padding: 0.55rem 0.75rem; border-bottom: 1px solid #e2e8f0; }
          tr:nth-child(even) { background: #f8fafc; }
          .section-title { font-size: 1rem; font-weight: 700; color: #002f6c; margin: 1.5rem 0 0.75rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
          .progress { display: inline-block; width: 60px; height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden; vertical-align: middle; margin-right: 6px; }
          .progress-fill { height: 100%; border-radius: 4px; }
          .footer { margin-top: 2rem; text-align: center; color: #94a3b8; font-size: 0.72rem; border-top: 1px solid #e2e8f0; padding-top: 1rem; }
          @media print { body { padding: 0.5rem; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🌱 Sembremos Seguridad — Consolidado Trimestral</h1>
          <p>Generado: ${new Date().toLocaleDateString('es-CR', { dateStyle: 'full' })} 
          ${filtroTrimestre !== 'TODOS' ? ' · ' + (TRIMESTRES.find(t => t.value === filtroTrimestre)?.label || '') : ''}
          ${filtroInstitucion !== 'TODOS' ? ' · ' + filtroInstitucion : ''}</p>
        </div>

        <div class="stats">
          <div class="stat">
            <div class="stat-label">Informes Aprobados</div>
            <div class="stat-value">${informesFiltrados.length}</div>
          </div>
          <div class="stat">
            <div class="stat-label">Instituciones</div>
            <div class="stat-value">${porInstitucion.length}</div>
          </div>
          <div class="stat">
            <div class="stat-label">Actividades</div>
            <div class="stat-value">${todasFilas.length}</div>
          </div>
          <div class="stat">
            <div class="stat-label">Avance General</div>
            <div class="stat-value">${promedioGeneral}%</div>
          </div>
        </div>

        <div class="section-title">Avance por Institución</div>
        <table>
          <thead><tr><th>Institución</th><th>Informes</th><th>Actividades</th><th>Avance Promedio</th></tr></thead>
          <tbody>
            ${porInstitucion.map(i => `
              <tr>
                <td><strong>${i.institucion}</strong></td>
                <td>${i.informes}</td>
                <td>${i.actividades}</td>
                <td>
                  <span class="progress"><span class="progress-fill" style="width:${i.promedio}%;background:${getProgressColor(i.promedio)}"></span></span>
                  ${i.promedio}%
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="section-title">Avance por Línea Estratégica</div>
        <table>
          <thead><tr><th>Línea Estratégica</th><th>Actividades</th><th>Avance Promedio</th></tr></thead>
          <tbody>
            ${porLinea.map(l => `
              <tr>
                <td>${l.linea}</td>
                <td>${l.actividades}</td>
                <td>
                  <span class="progress"><span class="progress-fill" style="width:${l.promedio}%;background:${getProgressColor(l.promedio)}"></span></span>
                  ${l.promedio}%
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="section-title">Detalle de Actividades</div>
        <table>
          <thead><tr><th>Institución</th><th>Línea Estratégica</th><th>Actividad</th><th>Indicador</th><th>Avance</th></tr></thead>
          <tbody>
            ${informesFiltrados.flatMap(inf =>
              (inf.filas || []).map(f => `
                <tr>
                  <td>${inf.institucion}</td>
                  <td>${f.lineaEstrategica}</td>
                  <td>${f.actividad}</td>
                  <td>${f.indicador || '—'}</td>
                  <td>${f.avance}%</td>
                </tr>
              `)
            ).join('')}
          </tbody>
        </table>

        <div class="footer">
          Sembremos Seguridad — Cantón de Puntarenas · Generado automáticamente
        </div>
      </body>
      </html>
    `;

    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 500);
  };

  // ── Ver detalle ──
  const verDetalle = async (informe) => {
    setDetalleInforme(informe);
    const hist = await informesService.getHistorial(informe.id);
    setHistorial(hist);
  };

  if (loading) return <div style={{ padding: '3rem', color: '#7a9cc4' }}>Cargando consolidado...</div>;

  return (
    <div className="informes-modulo">
      {/* ── Header ── */}
      <div className="informes-modulo__header">
        <h1 className="informes-modulo__title">
          <BarChart3 size={24} />
          Consolidado Trimestral
        </h1>
        <p className="informes-modulo__subtitle">
          Vista consolidada de todos los informes aprobados de las instituciones participantes. Solo se muestran datos validados.
        </p>
      </div>

      {/* ── Stats ── */}
      <div className="inf-stats-row">
        <div className="inf-stat-card" style={{ borderLeftColor: '#3b82f6' }}>
          <div className="inf-stat-card__label"><FileText size={15} color="#3b82f6" /> Informes Aprobados</div>
          <div className="inf-stat-card__value">{informesFiltrados.length}</div>
        </div>
        <div className="inf-stat-card" style={{ borderLeftColor: '#8b5cf6' }}>
          <div className="inf-stat-card__label"><Building2 size={15} color="#8b5cf6" /> Instituciones</div>
          <div className="inf-stat-card__value">{porInstitucion.length}</div>
        </div>
        <div className="inf-stat-card" style={{ borderLeftColor: '#0284c7' }}>
          <div className="inf-stat-card__label"><BarChart3 size={15} color="#0284c7" /> Actividades</div>
          <div className="inf-stat-card__value">{todasFilas.length}</div>
        </div>
        <div className="inf-stat-card" style={{ borderLeftColor: '#059669' }}>
          <div className="inf-stat-card__label"><TrendingUp size={15} color="#059669" /> Avance General</div>
          <div className="inf-stat-card__value" style={{ color: getProgressColor(promedioGeneral) }}>
            {promedioGeneral}%
          </div>
        </div>
      </div>

      {/* ── Filtros ── */}
      <div className="informes-modulo__controls" style={{ gap: '1.25rem' }}>
        <Filter size={16} color="#64748b" />
        <select
          className="informes-modulo__select"
          value={filtroTrimestre}
          onChange={e => setFiltroTrimestre(e.target.value)}
          style={{ minWidth: '200px' }}
        >
          <option value="TODOS">Todos los trimestres</option>
          {TRIMESTRES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>

        <select
          className="informes-modulo__select"
          value={filtroInstitucion}
          onChange={e => setFiltroInstitucion(e.target.value)}
          style={{ minWidth: '200px' }}
        >
          <option value="TODOS">Todas las instituciones</option>
          {instituciones.map(inst => <option key={inst} value={inst}>{inst}</option>)}
        </select>

        <button className="inf-btn inf-btn--primary" onClick={generarPDF}>
          <Download size={15} /> Generar PDF
        </button>
      </div>

      {/* ── Gráficas de avance por línea estratégica ── */}
      {porLinea.length > 0 && (
        <div style={{ marginBottom: '1.75rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            Avance por Línea Estratégica
          </h2>
          <div className="inf-tabla-wrap" style={{ padding: '1.25rem' }}>
            {porLinea.map((l, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '0.6rem 0',
                borderBottom: i < porLinea.length - 1 ? '1px solid #f1f5f9' : 'none'
              }}>
                <div style={{ flex: '0 0 240px', fontSize: '0.78rem', fontWeight: 600, color: '#0f172a' }}>
                  {l.linea}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    height: '12px', background: '#e2e8f0', borderRadius: '99px',
                    overflow: 'hidden', position: 'relative'
                  }}>
                    <div style={{
                      height: '100%', borderRadius: '99px',
                      width: `${l.promedio}%`,
                      background: l.promedio >= 75
                        ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                        : l.promedio >= 40
                          ? 'linear-gradient(90deg, #f59e0b, #eab308)'
                          : 'linear-gradient(90deg, #ef4444, #f97316)',
                      transition: 'width 0.6s ease'
                    }} />
                  </div>
                </div>
                <span style={{
                  fontSize: '0.82rem', fontWeight: 800, minWidth: '42px', textAlign: 'right',
                  color: getProgressColor(l.promedio)
                }}>
                  {l.promedio}%
                </span>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', minWidth: '70px' }}>
                  {l.actividades} actividad{l.actividades !== 1 ? 'es' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Ranking de instituciones ── */}
      {porInstitucion.length > 0 && (
        <div style={{ marginBottom: '1.75rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            Avance por Institución
          </h2>
          <div className="inf-tabla-wrap">
            <table className="inf-tabla">
              <thead>
                <tr>
                  <th>Institución</th>
                  <th>Informes</th>
                  <th>Actividades</th>
                  <th>Avance Promedio</th>
                </tr>
              </thead>
              <tbody>
                {porInstitucion.map((inst, i) => (
                  <tr key={i}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '28px', height: '28px', borderRadius: '8px',
                          background: 'linear-gradient(135deg, #002f6c, #0066cc)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', fontSize: '0.7rem', fontWeight: 800
                        }}>
                          {i + 1}
                        </div>
                        <span style={{ fontWeight: 600 }}>{inst.institucion}</span>
                      </div>
                    </td>
                    <td>{inst.informes}</td>
                    <td>{inst.actividades}</td>
                    <td>
                      <div className="inf-progress-cell">
                        <div className="inf-progress-bar" style={{ height: '10px' }}>
                          <div
                            className={`inf-progress-fill ${getProgressClass(inst.promedio)}`}
                            style={{ width: `${inst.promedio}%` }}
                          />
                        </div>
                        <span className="inf-progress-label" style={{ color: getProgressColor(inst.promedio) }}>
                          {inst.promedio}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Lista de informes aprobados ── */}
      <div style={{ marginTop: '1rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
          Informes Aprobados
        </h2>

        {informesFiltrados.length === 0 ? (
          <div className="inf-empty">
            <div className="inf-empty__icon">📊</div>
            <div className="inf-empty__text">No hay informes aprobados aún</div>
            <div className="inf-empty__sub">Los informes aprobados por las instituciones aparecerán aquí.</div>
          </div>
        ) : (
          <div className="inf-cards-grid">
            {informesFiltrados.map(inf => (
              <div
                key={inf.id}
                className="inf-card inf-card--aprobado"
                onClick={() => verDetalle(inf)}
              >
                <div className="inf-card__header">
                  <div>
                    <div className="inf-card__inst">{inf.institucion}</div>
                    <div className="inf-card__trimestre">
                      {TRIMESTRES.find(t => t.value === inf.trimestre)?.label || inf.trimestre}
                      {' · '}{inf.editorNombre}
                    </div>
                  </div>
                  <span className="inf-estado-badge inf-estado-badge--aprobado">
                    <CheckCircle size={12} /> Aprobado
                  </span>
                </div>

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
                    <span className="inf-card__meta-label">Avance</span>
                    <span className="inf-card__meta-value">{promedioAvance(inf.filas)}%</span>
                  </div>
                  <div className="inf-card__meta-item">
                    <span className="inf-card__meta-label">Aprobado</span>
                    <span className="inf-card__meta-value" style={{ fontSize: '0.72rem' }}>
                      {formatFecha(inf.fechaAprobacion)}
                    </span>
                  </div>
                  <div className="inf-card__meta-item">
                    <span className="inf-card__meta-label">Por</span>
                    <span className="inf-card__meta-value" style={{ fontSize: '0.72rem' }}>
                      {inf.aprobadoPor || '—'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Modal de detalle ── */}
      {detalleInforme && (
        <div className="inf-modal-overlay" onClick={() => setDetalleInforme(null)}>
          <div className="inf-modal" onClick={e => e.stopPropagation()}>
            <div className="inf-modal__header">
              <div>
                <div className="inf-modal__title">{detalleInforme.institucion}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                  {TRIMESTRES.find(t => t.value === detalleInforme.trimestre)?.label}
                  {' · Editor: '}{detalleInforme.editorNombre}
                  {' · Aprobado por: '}{detalleInforme.aprobadoPor || '—'}
                </div>
              </div>
              <button className="inf-btn inf-btn--ghost inf-btn--icon-only" onClick={() => setDetalleInforme(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="inf-modal__body">
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

              {/* Historial */}
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

            <div className="inf-modal__footer">
              <button className="inf-btn inf-btn--ghost" onClick={() => setDetalleInforme(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsolidadoTrimestral;
