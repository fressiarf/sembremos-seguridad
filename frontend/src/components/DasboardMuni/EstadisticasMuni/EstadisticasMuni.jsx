import React, { useState, useEffect } from 'react';
import { muniService } from '../../../services/muniService';
import { useToast } from '../../../context/ToastContext';
import TooltipMuni from '../TooltipMuni/TooltipMuni';
import {
  Users, DollarSign, BarChart3, Activity, TrendingUp,
  Building2, Megaphone, CheckCircle, Clock
} from 'lucide-react';
import './EstadisticasMuni.css';

const EstadisticasMuni = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await muniService.getFullMuniDashboard();
        setData(result);
      } catch (e) {
        showToast('Error al cargar estadísticas', 'error');
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

  if (loading) return <div style={{ padding: '3rem', color: '#7a9cc4' }}>Cargando estadísticas...</div>;
  if (!data) return null;

  const { kpis, gruposEtarios, lineasConProgreso, reportesRecientes } = data;

  const totalBeneficiados = Object.values(gruposEtarios).reduce((sum, v) => sum + v, 0);

  // Calcular inversión por tipo
  const tareasInfra = data.tareasPreventivas.filter(t => t.tipo === 2);
  const tareasSocial = data.tareasPreventivas.filter(t => t.tipo === 1);
  const inversionInfra = tareasInfra.reduce((sum, t) => sum + (t.inversionColones || 0), 0);
  const inversionSocial = tareasSocial.reduce((sum, t) => sum + (t.inversionColones || 0), 0);

  // Beneficiados por tipo de actividad
  const benefPorTipo = {};
  reportesRecientes.forEach(r => {
    const tipo = r.tipoActividad || 'Otro';
    benefPorTipo[tipo] = (benefPorTipo[tipo] || 0) + (r.beneficiados || 0);
  });

  // Max para barras horizontales
  const maxLinea = Math.max(...lineasConProgreso.map(l => l.totalTareas), 1);

  return (
    <div style={{ padding: '2rem 2.5rem', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: '0 0 4px', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
          Estadísticas de Impacto
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', margin: 0, textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
          Análisis del impacto comunitario de las actividades preventivas.
        </p>
      </div>

      {/* ── KPIs expandidos ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <div className="est-muni-card">
          <div className="est-muni-card-icon" style={{ background: '#ccfbf1' }}>
            <Building2 size={22} color="#0d9488" />
          </div>
          <div>
            <span className="est-muni-card-label">Espacios Públicos Recuperados</span>
            <span className="est-muni-card-value">{kpis.espaciosRecuperados}</span>
            <span className="est-muni-card-sub">de {tareasInfra.length} proyectos de infraestructura</span>
          </div>
        </div>

        <div className="est-muni-card">
          <div className="est-muni-card-icon" style={{ background: '#e0e7ff' }}>
            <Users size={22} color="#4f46e5" />
          </div>
          <div>
            <span className="est-muni-card-label">Total Población Beneficiada</span>
            <span className="est-muni-card-value">{totalBeneficiados}</span>
            <span className="est-muni-card-sub">personas alcanzadas por programas</span>
          </div>
        </div>

        <div className="est-muni-card">
          <div className="est-muni-card-icon" style={{ background: '#fce7f3' }}>
            <TrendingUp size={22} color="#db2777" />
          </div>
          <div>
            <span className="est-muni-card-label">Tasa de Cumplimiento</span>
            <span className="est-muni-card-value">{kpis.progresoGeneral}%</span>
            <span className="est-muni-card-sub">{kpis.tareasCompletadas} de {kpis.totalTareas} tareas completadas</span>
          </div>
        </div>
      </div>

      {/* ── Two Column Layout ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>

        {/* Inversión por tipo */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DollarSign size={18} /> Inversión por Tipo
            <TooltipMuni text="La columna Inversión debe reflejar el gasto municipal en infraestructura social (parques, iluminación, centros comunitarios) o programas preventivos (talleres, capacitaciones, campañas). No incluye gastos operativos policiales." maxWidth={360} />
          </h3>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.82rem', color: '#334155', fontWeight: 600 }}>🏗️ Infraestructura</span>
              <span style={{ fontSize: '0.82rem', color: '#0b2240', fontWeight: 800 }}>{formatColones(inversionInfra)}</span>
            </div>
            <div style={{ width: '100%', height: '10px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${kpis.inversionSocial > 0 ? Math.round((inversionInfra / kpis.inversionSocial) * 100) : 0}%`,
                background: 'linear-gradient(90deg, #0d9488, #14b8a6)',
                borderRadius: '999px',
                transition: 'width 0.6s ease'
              }} />
            </div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.82rem', color: '#334155', fontWeight: 600 }}>🤝 Social / Preventivo</span>
              <span style={{ fontSize: '0.82rem', color: '#0b2240', fontWeight: 800 }}>{formatColones(inversionSocial)}</span>
            </div>
            <div style={{ width: '100%', height: '10px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${kpis.inversionSocial > 0 ? Math.round((inversionSocial / kpis.inversionSocial) * 100) : 0}%`,
                background: 'linear-gradient(90deg, #8b5cf6, #a78bfa)',
                borderRadius: '999px',
                transition: 'width 0.6s ease'
              }} />
            </div>
          </div>
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px', marginTop: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', color: '#0b2240', fontWeight: 700 }}>Total Inversión Social</span>
              <span style={{ fontSize: '1rem', color: '#0d9488', fontWeight: 800 }}>{formatColones(kpis.inversionSocial)}</span>
            </div>
          </div>
        </div>

        {/* Beneficiados por grupo etario */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} /> Desglose por Grupo Etario
            <TooltipMuni text="Este desglose refleja la población alcanzada por las actividades preventivas según rango de edad. Los datos provienen de los reportes comunitarios aprobados por las instituciones." maxWidth={320} />
          </h3>
          {[
            { key: 'ninos', label: 'Niñez (0-12)', color: '#3b82f6', value: gruposEtarios.ninos },
            { key: 'jovenes', label: 'Juventud (13-24)', color: '#8b5cf6', value: gruposEtarios.jovenes },
            { key: 'adultos', label: 'Adultos (25-64)', color: '#f59e0b', value: gruposEtarios.adultos },
            { key: 'adultosMayores', label: 'Adultos Mayores (65+)', color: '#ef4444', value: gruposEtarios.adultosMayores },
          ].map(g => (
            <div key={g.key} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.82rem', color: '#334155', fontWeight: 600 }}>{g.label}</span>
                <div>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0b2240' }}>{g.value}</span>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginLeft: '4px' }}>
                    ({totalBeneficiados > 0 ? Math.round((g.value / totalBeneficiados) * 100) : 0}%)
                  </span>
                </div>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${totalBeneficiados > 0 ? Math.round((g.value / totalBeneficiados) * 100) : 0}%`,
                  backgroundColor: g.color,
                  borderRadius: '999px',
                  transition: 'width 0.6s ease'
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Avance por Línea de Acción (tabla) ── */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart3 size={18} /> Resumen por Línea de Acción
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ textAlign: 'left', padding: '8px 12px', color: '#64748b', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Línea</th>
              <th style={{ textAlign: 'center', padding: '8px 12px', color: '#64748b', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Tareas</th>
              <th style={{ textAlign: 'center', padding: '8px 12px', color: '#64748b', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Completadas</th>
              <th style={{ textAlign: 'center', padding: '8px 12px', color: '#64748b', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Avance</th>
              <th style={{ textAlign: 'right', padding: '8px 12px', color: '#64748b', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Inversión</th>
            </tr>
          </thead>
          <tbody>
            {lineasConProgreso.map(l => (
              <tr key={l.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 12px', fontWeight: 600, color: '#0b2240' }}>
                  L#{l.no} — {l.problematica}
                </td>
                <td style={{ textAlign: 'center', padding: '10px 12px', color: '#64748b' }}>{l.totalTareas}</td>
                <td style={{ textAlign: 'center', padding: '10px 12px' }}>
                  <span style={{ color: '#16a34a', fontWeight: 700 }}>{l.completadas}</span>
                </td>
                <td style={{ textAlign: 'center', padding: '10px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                    <div style={{ width: '60px', height: '6px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${l.progreso}%`,
                        backgroundColor: l.progreso >= 75 ? '#22c55e' : l.progreso >= 40 ? '#f59e0b' : '#94a3b8',
                        borderRadius: '999px'
                      }} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.78rem', color: l.progreso >= 75 ? '#16a34a' : '#64748b' }}>{l.progreso}%</span>
                  </div>
                </td>
                <td style={{ textAlign: 'right', padding: '10px 12px', fontWeight: 600, color: '#0b2240' }}>
                  {formatColones(l.inversion)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EstadisticasMuni;
