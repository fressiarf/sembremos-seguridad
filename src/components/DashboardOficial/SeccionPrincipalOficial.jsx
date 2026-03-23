import React, { useState, useEffect } from 'react';
import ListaMisTareas from './MainDashboardOficial/ListaMisTareas';
import HistorialContainer from './Historial/HistorialContainer';
import { oficialService } from '../../services/oficialService';
import { useToast } from '../../context/ToastContext';
import { CheckCircle, Clock, Activity, DollarSign } from 'lucide-react';

const SeccionPrincipalOficial = ({ activeView = 'dashboard' }) => {
  const [tareas, setTareas] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    totalTareas: 0, completadas: 0, pendientes: 0,
    inversionTotal: 0, progresoGeneral: 0
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Todas');
  const { showToast } = useToast();

  const OFICIAL_ID = '2'; // hardcodeado temporalmente

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await oficialService.getFullDashboardData(OFICIAL_ID);
      if (data) {
        setTareas(data.tareas);
        setEstadisticas(data.estadisticas);
      }
    } catch (error) {
      showToast('Error al cargar tus tareas', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const formatColones = (amount) => {
    if (!amount || amount === 0) return '₡0';
    return '₡' + amount.toLocaleString('es-CR');
  };

  if (loading) return <div style={{ padding: '3rem', color: '#7a9cc4' }}>Cargando datos...</div>;

  // ── Vista Historial de Reportes ──
  if (activeView === 'historial') {
    const tareasCompletadas = tareas.filter(t => t.completada);
    const registros = tareasCompletadas.map(t => ({
      fecha: t.fechaCompletada,
      oficial: t.institucionNombre,
      zona: t.zona || 'Asignada',
      lineaAccion: `${t.lineaNombre} - ${t.titulo}`,
      comentario: t.reporteInstitucion || 'Sin reporte detallado'
    }));
    return (
      <div style={{ padding: '2rem 2.5rem' }}>
        <HistorialContainer registros={registros} />
      </div>
    );
  }

  // ── Vista Dashboard (Solo Resumen / Estadísticas) ──
  if (activeView === 'dashboard') {
    return (
      <div style={{ padding: '2rem 2.5rem', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: '0 0 4px', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>Dashboard de Rendimiento</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', margin: 0, textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>Resumen de tus actividades, avance e inversión.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem', borderLeft: '4px solid #22c55e', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <CheckCircle size={18} color="#22c55e" />
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Completadas</span>
            </div>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0b2240' }}>{estadisticas.completadas}</span>
          </div>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem', borderLeft: '4px solid #f59e0b', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <Clock size={18} color="#f59e0b" />
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Pendientes</span>
            </div>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0b2240' }}>{estadisticas.pendientes}</span>
          </div>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem', borderLeft: '4px solid #3b82f6', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <Activity size={18} color="#3b82f6" />
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Progreso Total</span>
            </div>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0b2240' }}>{estadisticas.progresoGeneral}%</span>
          </div>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem', borderLeft: '4px solid #8b5cf6', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <DollarSign size={18} color="#8b5cf6" />
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Mi Inversión Total</span>
            </div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0b2240' }}>{formatColones(estadisticas.inversionTotal)}</span>
          </div>
        </div>
      </div>
    );
  }

  // ── Vista Mis Tareas (Solo Lista de Tareas y Filtros) ──
  const tareasFiltradas = tareas.filter(t => {
    if (filter === 'Completadas') return t.completada;
    if (filter === 'Pendientes') return !t.completada;
    return true; // 'Todas'
  });

  return (
    <div style={{ padding: '2rem 2.5rem', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: '0 0 4px', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>Mis Tareas Asignadas</h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', margin: 0, textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>Gestioná tus actividades y reportá tus avances diariamente.</p>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['Todas', 'Pendientes', 'Completadas'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '8px 18px',
              borderRadius: '20px',
              border: 'none',
              background: filter === f ? '#0b2240' : '#fff',
              color: filter === f ? '#fff' : '#0b2240',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Lista de Tareas Flat */}
      <ListaMisTareas
        tareas={tareasFiltradas}
        onUpdate={loadData}
      />
    </div>
  );
};

export default SeccionPrincipalOficial;
