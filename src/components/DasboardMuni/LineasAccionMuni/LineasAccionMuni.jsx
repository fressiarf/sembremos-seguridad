import React, { useState, useEffect } from 'react';
import { muniService } from '../../../services/muniService';
import { useToast } from '../../../context/ToastContext';
import TooltipMuni from '../TooltipMuni/TooltipMuni';
import {
  Activity, CheckCircle, MapPin, DollarSign,
  ChevronDown, ChevronUp, FileText
} from 'lucide-react';

const LineasAccionMuni = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await muniService.getFullMuniDashboard();
        setData(result);
      } catch (e) {
        showToast('Error al cargar líneas de acción', 'error');
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

  if (loading) return <div style={{ padding: '3rem', color: '#7a9cc4' }}>Cargando líneas de acción...</div>;
  if (!data) return null;

  const { lineasConProgreso } = data;

  return (
    <div style={{ padding: '2rem 2.5rem', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: '0 0 4px', textShadow: '0 2px 8px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          Líneas de Acción
          <TooltipMuni text="Estas líneas corresponden a factores de riesgo social y estructural identificados para intervención preventiva local. No incluyen operativos policiales ni datos de incidencia delictiva." />
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', margin: 0, textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
          Vista de lectura de las líneas de acción preventivas del cantón.
        </p>
      </div>

      {lineasConProgreso.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
          <FileText size={40} opacity={0.3} />
          <p style={{ margin: '8px 0 0' }}>No hay líneas de acción preventivas</p>
        </div>
      ) : (
        lineasConProgreso.map(linea => {
          const isExpanded = expandedId === linea.id;
          return (
            <div key={linea.id} style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              marginBottom: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              overflow: 'hidden',
              transition: 'box-shadow 0.2s',
            }}>
              {/* Header */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : linea.id)}
                style={{
                  padding: '1.1rem 1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  background: isExpanded ? '#f8fafc' : '#fff',
                  borderBottom: isExpanded ? '1px solid #e2e8f0' : 'none',
                  transition: 'background 0.2s',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <div style={{ padding: '6px', background: '#e0f2fe', color: '#0284c7', borderRadius: '8px' }}>
                      <Activity size={18} />
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                      Línea #{linea.no} — {linea.problematica}
                    </h3>
                  </div>
                  <p style={{ margin: '4px 0 0 40px', fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>
                    {linea.titulo}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      fontSize: '1.1rem',
                      fontWeight: 800,
                      color: linea.progreso >= 75 ? '#16a34a' : linea.progreso >= 40 ? '#f59e0b' : '#64748b'
                    }}>
                      {linea.progreso}%
                    </span>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600 }}>
                      {linea.completadas}/{linea.totalTareas} tareas
                    </div>
                  </div>
                  <div style={{ color: '#94a3b8' }}>
                    {isExpanded ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
                  </div>
                </div>
              </div>

              {/* Expanded: Tareas de la línea */}
              {isExpanded && (
                <div style={{ padding: '1.25rem' }}>
                  {/* Progress bar */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${linea.progreso}%`,
                        background: linea.progreso >= 75
                          ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                          : linea.progreso >= 40
                            ? 'linear-gradient(90deg, #f59e0b, #d97706)'
                            : 'linear-gradient(90deg, #94a3b8, #64748b)',
                        borderRadius: '999px',
                        transition: 'width 0.6s ease',
                      }} />
                    </div>
                  </div>

                  {/* Lista de tareas */}
                  {linea.tareas.map(t => (
                    <div key={t.id} style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      marginBottom: '8px',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            {t.completada ? (
                              <CheckCircle size={16} color="#16a34a" />
                            ) : (
                              <div style={{ width: '16px', height: '16px', border: '2px solid #cbd5e1', borderRadius: '50%' }} />
                            )}
                            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0b2240' }}>{t.titulo}</span>
                          </div>
                          <div style={{ display: 'flex', gap: '14px', fontSize: '0.72rem', color: '#64748b', marginLeft: '24px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <MapPin size={11} /> {t.zona || 'Sin zona'}
                            </span>
                            <span>{t.plazo}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <DollarSign size={11} /> {formatColones(t.presupuestoEstimado)}
                            </span>
                          </div>
                        </div>
                        <span style={{
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          padding: '2px 10px',
                          borderRadius: '999px',
                          textTransform: 'uppercase',
                          background: t.completada ? '#dcfce7' : t.estado === 'Con Actividades' ? '#fef3c7' : '#f1f5f9',
                          color: t.completada ? '#166534' : t.estado === 'Con Actividades' ? '#92400e' : '#64748b',
                        }}>
                          {t.completada ? 'Completada' : t.estado || 'Pendiente'}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Inversión total de la línea */}
                  <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '10px', marginTop: '8px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.82rem', color: '#0b2240', fontWeight: 700 }}>
                      Inversión línea: {formatColones(linea.inversion)}
                    </span>
                    <TooltipMuni text="Registre aquí el presupuesto municipal o recursos destinados a la mitigación de este riesgo social. Incluya gasto en infraestructura, materiales, capacitaciones o programas preventivos." maxWidth={300} />
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default LineasAccionMuni;
