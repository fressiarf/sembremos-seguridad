import React, { useState, useEffect } from 'react';
import { muniService } from '../../../services/muniService';
import { useToast } from '../../../context/ToastContext';
import TooltipMuni from '../TooltipMuni/TooltipMuni';
import {
  CheckCircle, Clock, Activity, MapPin, Filter, Search,
  Calendar as CalIcon, DollarSign, ChevronDown, ChevronUp, Plus
} from 'lucide-react';
import FormActividadMuni from './FormActividadMuni';
import './ActividadesPreventivas.css';

const ActividadesPreventivas = () => {
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { showToast } = useToast();

  const fetchData = async () => {
    try {
      const data = await muniService.getTareasPreventivas();
      setTareas(data);
    } catch (e) {
      showToast('Error al cargar actividades', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveActividad = async (nuevaTarea) => {
    try {
      await muniService.crearActividad(nuevaTarea);
      showToast('Actividad agregada exitosamente', 'success');
      setIsFormOpen(false);
      fetchData(); // Recargar la lista
    } catch (error) {
      showToast('Error al agregar actividad', 'error');
    }
  };

  const formatColones = (amount) => {
    if (!amount || amount === 0) return '₡0';
    return '₡' + amount.toLocaleString('es-CR');
  };

  if (loading) return <div style={{ padding: '3rem', color: '#7a9cc4' }}>Cargando actividades...</div>;

  const tareasFiltradas = tareas.filter(t => {
    if (filter === 'Completadas') return t.completada;
    if (filter === 'Pendientes') return !t.completada;
    if (filter === 'Social') return t.tipo === 1;
    if (filter === 'Infraestructura') return t.tipo === 2;
    return true;
  }).filter(t => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return t.titulo?.toLowerCase().includes(term) || t.zona?.toLowerCase().includes(term) || t.lineaNombre?.toLowerCase().includes(term);
  });

  return (
    <div style={{ padding: '2rem 2.5rem', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: '0 0 4px', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
          Actividades Preventivas
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', margin: 0, textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
          Tareas de prevención social e infraestructura comunitaria.
        </p>
      </div>

      {/* ── Filtros ── */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {['Todas', 'Pendientes', 'Completadas', 'Social', 'Infraestructura'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 16px',
              borderRadius: '999px',
              border: filter === f ? '2px solid #0d9488' : '1px solid #e2e8f0',
              background: filter === f ? '#ccfbf1' : '#ffffff',
              color: filter === f ? '#0d9488' : '#64748b',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {f}
          </button>
        ))}

        {/* Filtro de Delitos (Oculto/Restringido) */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <button
            disabled
            style={{
              padding: '6px 16px',
              borderRadius: '999px',
              border: '1px dashed #cbd5e1',
              background: '#f8fafc',
              color: '#adbbc9',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'not-allowed',
            }}
          >
            Delitos
          </button>
          <TooltipMuni
            text="La visualización de incidencia delictiva operativa es competencia exclusiva de la Fuerza Pública (Líder Técnico)."
            position="top"
            maxWidth={260}
          />
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Buscar actividad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '8px 12px 8px 36px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.82rem',
                outline: 'none',
                width: '180px',
                fontFamily: 'Inter, sans-serif',
              }}
            />
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            style={{
              padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#0d9488',
              color: '#fff', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Inter, sans-serif'
            }}
          >
            <Plus size={16} /> Nueva Actividad
          </button>
        </div>
      </div>

      {/* ── Conteo ── */}
      <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '1rem', fontWeight: 600 }}>
        Mostrando {tareasFiltradas.length} de {tareas.length} actividades
      </div>

      {/* ── Lista de Tareas ── */}
      {tareasFiltradas.length === 0 ? (
        <div className="muni-empty">
          <Filter size={40} opacity={0.3} />
          <p>No hay actividades con este filtro</p>
        </div>
      ) : (
        tareasFiltradas.map(t => {
          const isExpanded = expandedId === t.id;
          const estadoClase = t.completada ? 'completada' : t.estado === 'Con Actividades' ? 'con-act' : 'sin-act';
          const hoy = new Date();
          const fechaLimite = t.fechaLimite ? new Date(t.fechaLimite) : null;
          const diasRestantes = fechaLimite ? Math.ceil((fechaLimite - hoy) / (1000 * 60 * 60 * 24)) : null;

          return (
            <div key={t.id} className="act-prev-card" onClick={() => setExpandedId(isExpanded ? null : t.id)} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <span className={`act-prev-badge act-prev-badge--${estadoClase}`}>
                      {t.completada ? 'Completada' : t.estado || 'Pendiente'}
                    </span>
                    <span className={`act-prev-badge act-prev-badge--tipo-${t.tipo}`}>
                      {t.tipo === 1 ? 'Social' : 'Infraestructura'}
                    </span>
                    {diasRestantes !== null && !t.completada && diasRestantes <= 15 && (
                      <span style={{ fontSize: '0.65rem', color: diasRestantes < 0 ? '#ef4444' : '#f59e0b', fontWeight: 700 }}>
                        ⏰ {diasRestantes < 0 ? `Vencida hace ${Math.abs(diasRestantes)}d` : `${diasRestantes}d restantes`}
                      </span>
                    )}
                  </div>
                  <h3 style={{ margin: '0 0 4px', fontSize: '0.95rem', fontWeight: 700, color: '#0b2240' }}>{t.titulo}</h3>
                  <div style={{ display: 'flex', gap: '14px', fontSize: '0.75rem', color: '#64748b', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Activity size={12} /> L#{t.lineaNumero} — {t.lineaNombre}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} /> {t.zona || 'Sin zona'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CalIcon size={12} /> {t.fechaLimite || 'Sin plazo'}
                    </span>
                  </div>
                </div>
                <div style={{ color: '#94a3b8', marginLeft: '12px' }}>
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>INDICADOR</div>
                      <div style={{ fontSize: '0.82rem', color: '#0b2240', fontWeight: 600 }}>{t.indicador || 'No definido'}</div>
                    </div>
                    <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>META</div>
                      <div style={{ fontSize: '0.82rem', color: '#0b2240', fontWeight: 600 }}>{t.meta || 'No definida'}</div>
                    </div>
                    <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>PRESUPUESTO</div>
                      <div style={{ fontSize: '0.82rem', color: '#0b2240', fontWeight: 600 }}>{formatColones(t.presupuestoEstimado)}</div>
                    </div>
                  </div>
                  {t.evidenciaSeguimiento && (
                    <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '10px 12px', borderRadius: '8px', fontSize: '0.82rem', color: '#1e40af' }}>
                      <strong>Seguimiento:</strong> {t.evidenciaSeguimiento}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '16px', marginTop: '10px', fontSize: '0.75rem', color: '#64748b' }}>
                    <span><DollarSign size={12} style={{ verticalAlign: 'middle' }} /> Invertido: {formatColones(t.inversionColones)}</span>
                    <span>📄 Reportes aprobados: {t.reportesAprobados || 0}</span>
                    <span>👥 Avance acumulado: {t.avanceReal || 0} beneficiados</span>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}

      {/* Modal para agregar actividad */}
      <FormActividadMuni
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveActividad}
      />
    </div>
  );
};

export default ActividadesPreventivas;
