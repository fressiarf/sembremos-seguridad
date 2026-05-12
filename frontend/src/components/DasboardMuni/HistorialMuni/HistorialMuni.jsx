import React, { useState, useEffect } from 'react';
import { muniService } from '../../../services/muniService';
import { useToast } from '../../../context/ToastContext';
import {
  CheckCircle, Clock, FileText, Users, MapPin,
  Calendar as CalIcon, DollarSign
} from 'lucide-react';

const HistorialMuni = () => {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await muniService.getReportesComunitarios();
        setReportes(data.filter(r => r.estado === 'aprobado'));
      } catch (e) {
        showToast('Error al cargar historial', 'error');
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

  if (loading) return <div style={{ padding: '3rem', color: '#7a9cc4' }}>Cargando historial...</div>;

  return (
    <div style={{ padding: '2rem 2.5rem', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: '0 0 4px', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
          Historial de Actividades
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', margin: 0, textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
          Registro cronológico de actividades comunitarias completadas y aprobadas.
        </p>
      </div>

      {/* ── Resumen ── */}
      <div style={{
        background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px',
        padding: '16px 20px', marginBottom: '1.5rem', display: 'flex', gap: '2rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
      }}>
        <div>
          <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Total Actividades</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0b2240' }}>{reportes.length}</div>
        </div>
        <div>
          <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Total Beneficiados</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#3b82f6' }}>
            {reportes.reduce((sum, r) => sum + (r.beneficiados || 0), 0)}
          </div>
        </div>
        <div>
          <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Inversión Documentada</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0d9488' }}>
            {formatColones(reportes.reduce((sum, r) => sum + (r.inversionColones || 0), 0))}
          </div>
        </div>
      </div>

      {/* ── Timeline ── */}
      {reportes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
          <Clock size={40} opacity={0.3} />
          <p style={{ margin: '8px 0 0', fontSize: '0.9rem' }}>No hay actividades en el historial</p>
        </div>
      ) : (
        <div style={{ position: 'relative', paddingLeft: '28px' }}>
          {/* Línea vertical */}
          <div style={{
            position: 'absolute', left: '10px', top: '8px', bottom: '8px',
            width: '2px', background: '#e2e8f0', borderRadius: '999px'
          }} />

          {reportes.map((r, idx) => (
            <div key={r.id} style={{ position: 'relative', marginBottom: '16px' }}>
              {/* Dot */}
              <div style={{
                position: 'absolute', left: '-22px', top: '14px',
                width: '12px', height: '12px', borderRadius: '50%',
                background: '#22c55e', border: '2px solid #fff',
                boxShadow: '0 0 0 3px #dcfce7',
              }} />

              {/* Card */}
              <div style={{
                background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px',
                padding: '14px 18px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: '#0b2240' }}>
                    {r.tarea?.titulo || `Reporte ${r.id}`}
                  </h3>
                  <span style={{
                    background: '#dcfce7', color: '#166534',
                    fontSize: '0.65rem', fontWeight: 700, padding: '2px 10px',
                    borderRadius: '999px', textTransform: 'uppercase'
                  }}>
                    Aprobado
                  </span>
                </div>

                <p style={{ margin: '0 0 8px', fontSize: '0.82rem', color: '#475569', lineHeight: 1.6 }}>
                  {r.descripcion}
                </p>

                <div style={{ display: 'flex', gap: '16px', fontSize: '0.72rem', color: '#64748b', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CalIcon size={12} /> {r.fecha}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={12} color="#3b82f6" /> {r.beneficiados} beneficiados
                  </span>
                  {r.inversionColones > 0 && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <DollarSign size={12} color="#0d9488" /> {formatColones(r.inversionColones)}
                    </span>
                  )}
                  {r.tarea?.zona && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} /> {r.tarea.zona}
                    </span>
                  )}
                  {r.tarea?.lineaNombre && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FileText size={12} /> {r.tarea.lineaNombre}
                    </span>
                  )}
                </div>

                {/* Asistentes breakdown */}
                {r.asistentes && (
                  <div style={{
                    marginTop: '10px', display: 'flex', gap: '12px',
                    fontSize: '0.7rem', color: '#94a3b8', background: '#f8fafc',
                    padding: '8px 10px', borderRadius: '6px',
                  }}>
                    <span>Niñez: <b style={{ color: '#0b2240' }}>{r.asistentes.ninos || 0}</b></span>
                    <span>Jóvenes: <b style={{ color: '#0b2240' }}>{r.asistentes.jovenes || 0}</b></span>
                    <span>Adultos: <b style={{ color: '#0b2240' }}>{r.asistentes.adultos || 0}</b></span>
                    <span>Ad. Mayor: <b style={{ color: '#0b2240' }}>{r.asistentes.adultosMayores || 0}</b></span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistorialMuni;
