import React, { useState, useEffect } from 'react';
import { useLogin } from '../../../context/LoginContext';
import { AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import FormInstitucion from './FormInstitucion';

const ReportesRechazadosEditor = () => {
  const { user } = useLogin();
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReporte, setEditingReporte] = useState(null);

  const fetchRechazados = async () => {
    if (!user?.id) return;
    try {
      const [resReq, tareasReq] = await Promise.all([
        fetch(`http://localhost:5000/reportes?estado=rechazado&responsableId=${user.id}`),
        fetch('http://localhost:5000/tareas')
      ]);
      const rejected = await resReq.json();
      const tareas = await tareasReq.json();

      const enriquecidos = rejected.map(r => ({
        ...r,
        tarea: tareas.find(t => t.id === r.tareaId) || {}
      }));
      setReportes(enriquecidos);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRechazados();
  }, [user]);

  if (editingReporte) {
    return (
      <div style={{ fontFamily: 'Inter, sans-serif' }}>
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={() => setEditingReporte(null)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', background: 'none', border: 'none', color: '#64748b', fontSize: '1rem', fontWeight: 600 }}
          >
            <ArrowLeft size={18} /> Volver
          </button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            Corrigiendo Reporte
          </h1>
        </div>
        <div style={{ background: '#fef2f2', padding: '12px 16px', borderRadius: '10px', borderLeft: '4px solid #ef4444', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertCircle size={20} color="#b91c1c" />
          <div style={{ color: '#991b1b', fontSize: '0.9rem', fontWeight: 500 }}>
            <strong>Corrección requerida:</strong> "{editingReporte.observacionRechazo}"
          </div>
        </div>
        <FormInstitucion 
          tarea={editingReporte.tarea} 
          initialReporte={editingReporte}
          onComplete={() => {
            setEditingReporte(null);
            setLoading(true);
            fetchRechazados();
          }} 
        />
      </div>
    );
  }

  if (loading) return <div style={{ padding: '3rem', color: '#7a9cc4' }}>Cargando devoluciones...</div>;

  if (reportes.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
        <AlertCircle size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
        <h3 style={{ margin: 0, color: '#0f172a' }}>No tienes reportes devueltos</h3>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '8px' }}>¡Excelente trabajo! Tus reportes enviados han sido aprobados o están en revisión.</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: '0 0 4px', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>Devoluciones Pendientes</h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', margin: 0, textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
          Estos reportes fueron devueltos por el administrador para realizar correcciones.
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {reportes.map(r => (
          <div key={r.id} style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', borderLeft: '4px solid #ef4444', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ background: '#fef2f2', color: '#b91c1c', padding: '4px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>RECHAZADO</span>
                <h3 style={{ margin: '8px 0 4px', fontSize: '1.1rem', color: '#0f172a' }}>{r.tarea?.titulo || 'Tarea Desconocida'}</h3>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Enviado originalmente: {r.fecha}</div>
              </div>
              <button 
                style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'background 0.2s' }}
                onClick={() => setEditingReporte(r)}
                onMouseOver={(e) => e.currentTarget.style.background = '#2563eb'}
                onMouseOut={(e) => e.currentTarget.style.background = '#3b82f6'}
              >
                Corregir Reporte <ArrowRight size={16} />
              </button>
            </div>
            
            <div style={{ marginTop: '1.25rem', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertCircle size={14} color="#f59e0b" />
                OBSERVACIÓN DEL ADMINISTRADOR
              </div>
              <div style={{ fontSize: '0.9rem', color: '#b91c1c', fontWeight: 500, fontStyle: 'italic' }}>"{r.observacionRechazo}"</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportesRechazadosEditor;
