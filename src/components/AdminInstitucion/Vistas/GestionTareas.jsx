import React, { useState, useEffect } from 'react';
import { adminInstitucionService } from '../../../services/adminInstitucionService';
import { useToast } from '../../../context/ToastContext';
import { Activity, Users, Target, MapPin, Calendar, ClipboardList, Search } from 'lucide-react';
import '../AdminInstitucion.css';

const GestionTareas = () => {
  const [tareas, setTareas] = useState([]);
  const [responsables, setResponsables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [filtroLinea, setFiltroLinea] = useState('Todos');
  const [filtroTrimestre, setFiltroTrimestre] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');
  const { showToast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const [tareasData, responsablesData] = await Promise.all([
        adminInstitucionService.getTareas({
          estado: filtroEstado,
          lineaId: filtroLinea === 'Todos' ? null : filtroLinea,
          trimestre: filtroTrimestre,
          busqueda,
        }),
        adminInstitucionService.getResponsables(),
      ]);
      setTareas(tareasData);
      setResponsables(responsablesData);
    } catch (e) {
      showToast('Error al cargar tareas', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [filtroEstado, filtroLinea, filtroTrimestre, busqueda]);

  const handleAsignar = async (tareaId, responsableId) => {
    try {
      const result = await adminInstitucionService.asignarResponsable(tareaId, responsableId);
      if (result.success) {
        showToast('Responsable asignado correctamente', 'success');
        loadData();
      }
    } catch (e) {
      showToast('Error al asignar responsable', 'error');
    }
  };

  if (loading) return <div style={{ padding: '3rem', color: '#7a9cc4' }}>Cargando tareas...</div>;

  // Group by linea
  const tareasGrouped = {};
  tareas.forEach(t => {
    const key = t.lineaId;
    if (!tareasGrouped[key]) {
      tareasGrouped[key] = { linea: t.linea, tareas: [] };
    }
    tareasGrouped[key].tareas.push(t);
  });

  const getBadgeClass = (estado) => {
    if (estado === 'Completado') return 'admin-inst-badge--completado';
    if (estado === 'Con Actividades') return 'admin-inst-badge--con-actividades';
    return 'admin-inst-badge--sin-actividades';
  };

  return (
    <div style={{ padding: '2rem 2.5rem', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: '0 0 4px', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
          Gestión de Tareas
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', margin: 0, textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
          Asigna responsables y supervisa las tareas de tu institución.
        </p>
      </div>

      {/* Filters */}
      <div className="admin-inst-filters">
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Buscar tarea..."
            className="admin-inst-search"
            style={{ paddingLeft: '32px' }}
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <select className="admin-inst-select" value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
          <option value="Todos">Todos los estados</option>
          <option value="Sin Actividades">Sin Actividades</option>
          <option value="Con Actividades">Con Actividades</option>
          <option value="Completado">Completado</option>
        </select>

        <select className="admin-inst-select" value={filtroLinea} onChange={e => setFiltroLinea(e.target.value)}>
          <option value="Todos">Todas las líneas</option>
          <option value="linea-1">Línea #1 — Consumo de drogas</option>
          <option value="linea-3">Línea #3 — Personas en sit. de calle</option>
          <option value="linea-4">Línea #4 — Falta de inversión social</option>
        </select>

        <select className="admin-inst-select" value={filtroTrimestre} onChange={e => setFiltroTrimestre(e.target.value)}>
          <option value="Todos">Todos los trimestres</option>
          <option value="I Trimestre 2025">I Trimestre 2025</option>
          <option value="II Trimestre 2025">II Trimestre 2025</option>
          <option value="III Trimestre 2025">III Trimestre 2025</option>
          <option value="IV Trimestre 2025">IV Trimestre 2025</option>
        </select>
      </div>

      {/* Tasks grouped by línea */}
      {tareas.length === 0 ? (
        <div className="admin-inst-empty">
          <ClipboardList size={48} opacity={0.3} />
          <h3>No hay tareas con estos filtros</h3>
          <p>Ajusta los filtros para ver las tareas asignadas a tu institución.</p>
        </div>
      ) : (
        Object.entries(tareasGrouped).map(([lineaId, group]) => (
          <div key={lineaId} style={{ marginBottom: '2rem' }}>
            <h3 style={{
              fontSize: '0.85rem', fontWeight: 800, color: '#fff', margin: '0 0 0.75rem',
              display: 'flex', alignItems: 'center', gap: '8px',
              textTransform: 'uppercase', letterSpacing: '0.04em',
              textShadow: '0 2px 6px rgba(0,0,0,0.3)',
            }}>
              <Activity size={16} />
              Línea #{group.linea?.numero} — {group.linea?.nombre}
            </h3>

            {group.tareas.map(tarea => (
              <div key={tarea.id} className="admin-inst-task-card">
                <div className="admin-inst-task-linea">
                  <Target size={12} />
                  Indicador: {tarea.indicador} · Meta: {tarea.meta} · {tarea.trimestre}
                </div>

                <div className="admin-inst-task-body">
                  <div className="admin-inst-task-info">
                    <h4 className="admin-inst-task-title">{tarea.titulo}</h4>
                    <p className="admin-inst-task-desc">{tarea.descripcion}</p>
                    <div className="admin-inst-task-meta">
                      <span className="admin-inst-meta-tag">
                        <MapPin size={12} /> {tarea.zona}
                      </span>
                      <span className="admin-inst-meta-tag">
                        <Calendar size={12} /> {tarea.fechaLimite}
                      </span>
                      <span className={`admin-inst-badge ${getBadgeClass(tarea.estado)}`}>
                        {tarea.estado}
                      </span>
                    </div>
                  </div>

                  <div className="admin-inst-task-actions">
                    <div style={{ marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                        RESPONSABLE ASIGNADO
                      </span>
                      <select
                        className="admin-inst-select"
                        value={tarea.responsableId || ''}
                        onChange={(e) => handleAsignar(tarea.id, e.target.value)}
                      >
                        <option value="">— Sin asignar —</option>
                        {responsables.map(r => (
                          <option key={r.id} value={r.id}>{r.nombre}</option>
                        ))}
                      </select>
                    </div>
                    {tarea.responsable && (
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                        {tarea.responsable.cargo}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default GestionTareas;
