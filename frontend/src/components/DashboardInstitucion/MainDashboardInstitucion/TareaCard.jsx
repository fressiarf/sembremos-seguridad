import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, DollarSign, Camera, Activity, ScrollText, ChevronDown, ChevronUp } from 'lucide-react';
import FormInstitucion from './FormInstitucion';

const TareaCard = ({ tarea, onUpdate }) => {
  const [isReporting, setIsReporting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [reportes, setReportes] = useState([]);

  useEffect(() => {
    fetchReportes();
  }, [tarea.id]);

  const fetchReportes = async () => {
    try {
      const res = await fetch(`http://localhost:5000/reportes?tareaId=${tarea.id}`);
      if (res.ok) {
        const data = await res.json();
        setReportes(data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const formatColones = (amount) => {
    if (!amount || amount === 0) return '₡0';
    return '₡' + amount.toLocaleString('es-CR');
  };

  // El progreso real viene del servicio de datos (ya implementado)
  const progreso = tarea.progresoReal || 0;
  const isCompletada = tarea.completada || progreso >= 100;

  return (
    <div style={{
      background: '#fff',
      border: `1px solid ${isCompletada ? '#bbf7d0' : '#e2e8f0'}`,
      borderRadius: '12px',
      overflow: 'hidden',
      marginBottom: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
    }}>
      {/* Línea de Acción */}
      <div style={{
        padding: '10px 16px',
        background: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={14} color="#64748b" />
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            {tarea.lineaAccionId} · {tarea.lineaNombre} 
          </span>
        </div>
        <div style={{ fontSize: '0.7rem', fontWeight: 600, color: progreso === 100 ? '#22c55e' : '#3b82f6', background: progreso === 100 ? '#f0fdf4' : '#eff6ff', padding: '2px 8px', borderRadius: '12px' }}>
          Avance: {progreso}%
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: '14px', flex: 1 }}>
            <div style={{ marginTop: '2px' }}>
              {isCompletada ? <CheckCircle size={22} color="#22c55e" /> : <Clock size={22} color="#94a3b8" />}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 4px', fontSize: '1.05rem', fontWeight: 700, color: '#0b2240' }}>
                {tarea.titulo}
              </h3>
              {tarea.descripcion && (
                <p style={{ margin: '0 0 10px', fontSize: '0.85rem', color: '#64748b' }}>
                  {tarea.descripcion}
                </p>
              )}

              {/* Métrica de Meta */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  <strong>Meta:</strong> {tarea.meta} {tarea.tipo === 1 ? 'Personas' : tarea.tipo === 2 ? 'Avance %' : ''}
                </div>
                {tarea.indicador && (
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    <strong>Indicador:</strong> {tarea.indicador}
                  </div>
                )}
              </div>

              {/* Bitácora / Historial de Reportes */}
              {reportes.length > 0 && (
                <div style={{ marginTop: '10px' }}>
                  <button 
                    onClick={() => setShowHistory(!showHistory)}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '6px', 
                      background: 'none', border: 'none', color: '#3b82f6', 
                      fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', padding: 0 
                    }}
                  >
                    <ScrollText size={14} /> 
                    {showHistory ? 'Ocultar Bitácora' : `Ver Bitácora (${reportes.length} reportes)`}
                    {showHistory ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  {showHistory && (
                    <div style={{ marginTop: '12px', paddingLeft: '8px', borderLeft: '2px solid #e2e8f0' }}>
                      {reportes.map((r, idx) => (
                        <div key={r.id} style={{ marginBottom: '12px', position: 'relative' }}>
                          <div style={{ position: 'absolute', left: '-13px', top: '4px', width: '8px', height: '8px', borderRadius: '50%', background: r.estado === 'aprobado' ? '#22c55e' : '#f59e0b' }} />
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, marginBottom: '2px' }}>
                            {r.fecha} · {r.estado.toUpperCase()}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.4 }}>
                            {r.descripcion}
                          </div>
                          {r.beneficiados > 0 && (
                            <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, marginTop: '2px' }}>
                              + {r.beneficiados} {tarea.tipo === 1 ? 'beneficiados' : 'unidades'}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Botón de acción (Habilitado mientras no esté al 100%) */}
          {!isCompletada ? (
            <button
              onClick={() => setIsReporting(!isReporting)}
              style={{
                background: isReporting ? '#ef4444' : '#0b2240',
                color: '#fff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              {isReporting ? 'Cancelar' : '✓ Registrar Avance'}
            </button>
          ) : (
             <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#22c55e', fontWeight: 700, fontSize: '0.85rem' }}>
                <CheckCircle size={18} /> Finalizada
             </div>
          )}
        </div>
      </div>

      {/* Formulario de reporte */}
      {isReporting && !isCompletada && (
        <div style={{ borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <FormInstitucion
            tarea={tarea}
            onComplete={() => {
              setIsReporting(false);
              fetchReportes(); // Recargar historial local
              onUpdate(); // Notificar al padre
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TareaCard;
