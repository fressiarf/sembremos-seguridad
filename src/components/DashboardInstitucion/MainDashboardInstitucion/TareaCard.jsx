import React, { useState } from 'react';
import { CheckCircle, Clock, DollarSign, Camera, Activity } from 'lucide-react';
import FormInstitucion from './FormInstitucion';

const TareaCard = ({ tarea, onUpdate }) => {
  const [isReporting, setIsReporting] = useState(false);

  const formatColones = (amount) => {
    if (!amount || amount === 0) return '₡0';
    return '₡' + amount.toLocaleString('es-CR');
  };

  return (
    <div style={{
      background: '#fff',
      border: `1px solid ${tarea.completada ? '#bbf7d0' : '#e2e8f0'}`,
      borderRadius: '12px',
      overflow: 'hidden',
      marginBottom: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
    }}>
      {/* Información de la Línea a la que pertenece */}
      <div style={{
        padding: '10px 16px',
        background: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <Activity size={14} color="#64748b" />
        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
          {tarea.lineaAccionId} · {tarea.lineaNombre} 
        </span>
      </div>

      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          
          {/* Detalles de la tarea */}
          <div style={{ display: 'flex', gap: '14px', flex: 1 }}>
            <div style={{ marginTop: '2px' }}>
              {tarea.completada ? <CheckCircle size={22} color="#22c55e" /> : <Clock size={22} color="#94a3b8" />}
            </div>
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: '1.05rem', fontWeight: 700, color: '#0b2240' }}>
                {tarea.titulo}
              </h3>
              {tarea.descripcion && (
                <p style={{ margin: '0 0 10px', fontSize: '0.85rem', color: '#64748b' }}>
                  {tarea.descripcion}
                </p>
              )}
              
              {/* Información si está completada */}
              {tarea.completada && (
                <div style={{ background: '#f0fdf4', padding: '12px 14px', borderRadius: '8px', border: '1px solid #bbf7d0', marginTop: '10px' }}>
                  {tarea.reporteInstitucion && (
                    <div style={{ fontSize: '0.85rem', color: '#166534', fontStyle: 'italic', marginBottom: '10px' }}>
                      "{tarea.reporteInstitucion}"
                    </div>
                  )}
                  {/* Activity info row */}
                  {(tarea.tipoActividad || tarea.lugar) && (
                    <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: '#166534', fontWeight: 600, marginBottom: '8px', flexWrap: 'wrap' }}>
                      {tarea.tipoActividad && (
                        <span style={{ background: '#dcfce7', padding: '2px 8px', borderRadius: '4px' }}>
                          📋 {tarea.tipoActividad}
                        </span>
                      )}
                      {tarea.lugar && (
                        <span style={{ background: '#dcfce7', padding: '2px 8px', borderRadius: '4px' }}>
                          📍 {tarea.lugar}
                        </span>
                      )}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem', color: '#166534', fontWeight: 600, flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {tarea.fechaRealizacion || tarea.fechaCompletada}
                    </span>
                    {(tarea.totalAsistentes > 0) && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        👥 {tarea.totalAsistentes} asistentes
                      </span>
                    )}
                    {tarea.inversionColones > 0 && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <DollarSign size={12} /> {formatColones(tarea.inversionColones)}
                      </span>
                    )}
                    {(tarea.archivos?.length > 0 || tarea.fotos?.length > 0) && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Camera size={12} /> {(tarea.archivos?.length || tarea.fotos?.length)} archivo(s)
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Botón de acción */}
          {!tarea.completada && (
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
              {isReporting ? 'Cancelar' : '✓ Completar Tarea'}
            </button>
          )}
        </div>
      </div>

      {/* Formulario de reporte */}
      {isReporting && !tarea.completada && (
        <div style={{ borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <FormInstitucion
            tarea={tarea}
            onComplete={() => {
              setIsReporting(false);
              onUpdate();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TareaCard;
