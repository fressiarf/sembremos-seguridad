import React, { useState, useEffect } from 'react';
import { muniService } from '../../../services/muniService';
import { useToast } from '../../../context/ToastContext';
import TooltipMuni from '../TooltipMuni/TooltipMuni';
import {
  Building2, Users, DollarSign, Megaphone,
  CheckCircle, Activity, AlertTriangle, MapPin, Calendar as CalIcon
} from 'lucide-react';
import './ResumenComunitario.css';

const ETARIO_COLORS = {
  ninos: '#3b82f6',
  jovenes: '#8b5cf6',
  adultos: '#f59e0b',
  adultosMayores: '#ef4444',
};

const ETARIO_LABELS = {
  ninos: 'Niñez',
  jovenes: 'Juventud',
  adultos: 'Adultos',
  adultosMayores: 'Adultos Mayores',
};

const ResumenComunitario = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await muniService.getFullMuniDashboard();
        setData(result);
      } catch (e) {
        showToast('Error al cargar datos del dashboard', 'error');
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

  if (loading) return <div style={{ padding: '3rem', color: '#7a9cc4' }}>Cargando datos comunitarios...</div>;
  if (!data) return null;

  const { kpis, gruposEtarios, lineasConProgreso, reportesRecientes, tareasUrgentes } = data;

  // Donut chart calculations
  const totalBeneficiados = Object.values(gruposEtarios).reduce((sum, v) => sum + v, 0);
  const donutSegments = Object.entries(gruposEtarios).map(([key, value]) => ({
    key,
    label: ETARIO_LABELS[key],
    value,
    color: ETARIO_COLORS[key],
    percentage: totalBeneficiados > 0 ? Math.round((value / totalBeneficiados) * 100) : 0
  }));

  // Build conic-gradient for donut
  let gradientParts = [];
  let currentAngle = 0;
  donutSegments.forEach(seg => {
    const angle = (seg.value / (totalBeneficiados || 1)) * 360;
    gradientParts.push(`${seg.color} ${currentAngle}deg ${currentAngle + angle}deg`);
    currentAngle += angle;
  });
  const conicGradient = `conic-gradient(${gradientParts.join(', ')})`;

  return (
    <div style={{ padding: '2rem 2.5rem', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: '0 0 4px', textShadow: '0 2px 8px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          Resumen Comunitario
          <TooltipMuni text="Este panel muestra exclusivamente indicadores de prevención social y gestión comunitaria. Como Socio Estratégico, su enfoque está en las causas estructurales del riesgo, no en la ejecución policial." />
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', margin: 0, textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
          Impacto social, prevención y gestión de espacios públicos.
        </p>
      </div>

      {/* ── KPI Cards ── */}
      <div className="muni-stats-grid">
        <div className="muni-stat-card" style={{ borderLeft: '4px solid #0d9488' }}>
          <div className="muni-stat-header">
            <Building2 size={18} color="#0d9488" />
            <span className="muni-stat-label">Espacios Recuperados</span>
          </div>
          <span className="muni-stat-value">{kpis.espaciosRecuperados}</span>
        </div>

        <div className="muni-stat-card" style={{ borderLeft: '4px solid #3b82f6' }}>
          <div className="muni-stat-header">
            <Users size={18} color="#3b82f6" />
            <span className="muni-stat-label">Población Beneficiada</span>
          </div>
          <span className="muni-stat-value">{kpis.poblacionBeneficiada}</span>
        </div>

        <div className="muni-stat-card" style={{ borderLeft: '4px solid #8b5cf6' }}>
          <div className="muni-stat-header">
            <DollarSign size={18} color="#8b5cf6" />
            <span className="muni-stat-label">Inversión Social</span>
            <TooltipMuni text="Registre aquí el presupuesto municipal o recursos destinados a la mitigación de riesgos sociales: infraestructura comunitaria, programas preventivos y recuperación de espacios." maxWidth={340} />
          </div>
          <span className="muni-stat-value" style={{ fontSize: '1.4rem' }}>{formatColones(kpis.inversionSocial)}</span>
        </div>

        <div className="muni-stat-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div className="muni-stat-header">
            <Megaphone size={18} color="#f59e0b" />
            <span className="muni-stat-label">Campañas Activas</span>
          </div>
          <span className="muni-stat-value">{kpis.campanasActivas}</span>
        </div>
      </div>

      {/* ── Second Row: Donut + Líneas ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Donut Chart */}
        <div className="muni-donut-container">
          <h3 className="muni-section-title">
            <Users size={18} /> Beneficiados por Grupo Etario
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              position: 'relative',
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              background: totalBeneficiados > 0 ? conicGradient : '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0b2240', lineHeight: 1 }}>
                  {totalBeneficiados}
                </span>
                <span style={{ fontSize: '0.6rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em', marginTop: '2px' }}>
                  Total
                </span>
              </div>
            </div>
          </div>
          <div className="muni-donut-legend">
            {donutSegments.map(seg => (
              <div key={seg.key} className="muni-donut-legend-item">
                <span className="muni-donut-legend-dot" style={{ backgroundColor: seg.color }} />
                <span>{seg.label}</span>
                <span className="muni-donut-legend-value">{seg.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Avance por Línea de Acción */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <h3 className="muni-section-title">
            <Activity size={18} /> Avance por Línea de Acción
            <TooltipMuni text="Estas líneas corresponden a factores de riesgo social y estructural identificados para intervención preventiva local. El avance refleja el progreso de tareas comunitarias asignadas." />
          </h3>
          {lineasConProgreso.length === 0 ? (
            <div className="muni-empty">
              <CheckCircle size={40} opacity={0.3} />
              <p>No hay líneas preventivas activas</p>
            </div>
          ) : (
            lineasConProgreso.map(linea => (
              <div key={linea.id} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0b2240' }}>
                      L#{linea.no || '?'} — {linea.problematica}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginLeft: '8px' }}>
                      {linea.completadas}/{linea.totalTareas} tareas
                    </span>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: linea.progreso >= 75 ? '#16a34a' : linea.progreso >= 40 ? '#f59e0b' : '#64748b' }}>
                    {linea.progreso}%
                  </span>
                </div>
                <div className="muni-progress-bar">
                  <div
                    className="muni-progress-fill"
                    style={{
                      width: `${linea.progreso}%`,
                      background: linea.progreso >= 75
                        ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                        : linea.progreso >= 40
                          ? 'linear-gradient(90deg, #f59e0b, #d97706)'
                          : 'linear-gradient(90deg, #94a3b8, #64748b)'
                    }}
                  />
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Inversión: {formatColones(linea.inversion)}
                  <TooltipMuni text="Monto total en colones destinado por la Municipalidad a la mitigación de este riesgo social a través de programas preventivos o infraestructura." maxWidth={280} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Third Row: Urgentes + Reportes Recientes ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
        {/* Tareas próximas a vencer */}
        <div>
          <h3 className="muni-section-title">
            <AlertTriangle size={18} /> Tareas Próximas a Vencer
          </h3>
          {tareasUrgentes.length === 0 ? (
            <div className="muni-empty">
              <CheckCircle size={40} opacity={0.3} />
              <p>No hay tareas urgentes</p>
            </div>
          ) : (
            tareasUrgentes.map(t => {
              const vencida = t.diasRestantes < 0;
              const proxima = t.diasRestantes >= 0 && t.diasRestantes <= 15;
              const clase = vencida ? 'muni-urgente-item--vencida' : proxima ? 'muni-urgente-item--proxima' : 'muni-urgente-item--normal';
              return (
                <div key={t.id} className={`muni-urgente-item ${clase}`}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: '#0b2240', fontSize: '0.9rem', marginBottom: '4px' }}>{t.titulo}</div>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: '#64748b' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Activity size={12} /> L#{t.lineaNumero}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} /> {t.zona}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.7rem', color: vencida ? '#ef4444' : '#64748b', fontWeight: 600 }}>
                      <CalIcon size={11} style={{ verticalAlign: 'middle', marginRight: '3px' }} />
                      {vencida ? `Vencida hace ${Math.abs(t.diasRestantes)} días` : `${t.diasRestantes} días restantes`}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Reportes Recientes */}
        <div>
          <h3 className="muni-section-title">
            <CheckCircle size={18} /> Reportes Aprobados Recientes
          </h3>
          {reportesRecientes.length === 0 ? (
            <div className="muni-empty">
              <CheckCircle size={40} opacity={0.3} />
              <p>No hay reportes recientes</p>
            </div>
          ) : (
            reportesRecientes.filter(r => r.estado === 'aprobado').slice(0, 5).map(r => (
              <div key={r.id} style={{
                background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px',
                padding: '12px 14px', marginBottom: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <div style={{ fontWeight: 700, color: '#0b2240', fontSize: '0.88rem' }}>
                    {r.tarea?.titulo || 'Sin tarea'}
                  </div>
                  <span style={{ background: '#dcfce7', color: '#166534', fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', textTransform: 'uppercase' }}>
                    {r.estado}
                  </span>
                </div>
                <p style={{ margin: '0 0 6px', fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5 }}>
                  {r.descripcion.length > 100 ? r.descripcion.substring(0, 100) + '...' : r.descripcion}
                </p>
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>
                  <span>👥 {r.beneficiados} beneficiados</span>
                  <span><CalIcon size={11} style={{ verticalAlign: 'middle' }} /> {r.fecha}</span>
                  {r.inversionColones > 0 && <span>💰 {formatColones(r.inversionColones)}</span>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumenComunitario;
