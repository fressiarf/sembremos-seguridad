import React, { useState, useEffect } from 'react';
import './ActividadOficiales.css';
import { useToast } from '../../../context/ToastContext';
import { dashboardService } from '../../../services/dashboardService';
import { userService } from '../../../services/userService';
import { Users, Edit, Clock, Plus, X, ListTodo, MapPin, User as UserIcon, Calendar, FileText } from 'lucide-react';

const ActividadOficiales = () => {
  const [selectedOfficer, setSelectedOfficer] = useState('Todos los oficiales');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [officers, setOfficers] = useState([]); // Lista de oficiales reales
  const [newActivity, setNewActivity] = useState({
    titulo: '',
    problematica: '',
    lineaAccion: '',
    propuestaMeta: '',
    responsables: '',
    descripcion: '',
    oficialId: '2',
    oficialNombre: 'Juan Vargas',
    zona: 'Barranca',
    status: 'Pendiente'
  });
  const { showToast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      // Cargar actividades
      const dashData = await dashboardService.getFullDashboardData();
      if (dashData && dashData.activities) {
        const mapped = dashData.activities.map(act => ({
          id: act.id,
          date: act.fecha || 'Reciente',
          officer: act.oficialNombre || 'Sin asignar',
          zone: act.zona || 'N/A',
          action: act.lineaAccion || `LA-2024-${act.id.toString().padStart(2, '0')}`,
          title: act.titulo || act.problematica || 'Sin título',
          status: act.status,
          statusClass: act.status.toLowerCase().replace(' ', '').replace('ó', 'o'),
          desc: act.descripcion || act.propuestaMeta,
          color: act.status === 'Completada' ? '#22c55e' : (act.status.toLowerCase().includes('ejecución') ? '#3b82f6' : '#f59e0b')
        }));
        setActivities(mapped);
      }

      // Cargar oficiales reales para el select
      const allUsers = await userService.getUsers();
      const onlyOfficers = allUsers.filter(u => u.rol === 'oficial');
      setOfficers(onlyOfficers);

      // Si hay oficiales, establecer el primero por defecto en el form
      if (onlyOfficers.length > 0) {
        setNewActivity(prev => ({
          ...prev,
          oficialId: onlyOfficers[0].id.toString(),
          oficialNombre: onlyOfficers[0].nombre
        }));
      }

    } catch (error) {
      showToast('Error al sincronizar datos operativos', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateActivity = async (e) => {
    e.preventDefault();
    if (!newActivity.titulo || !newActivity.problematica || !newActivity.lineaAccion) {
      showToast('Por favor completa los campos obligatorios (*)', 'warning');
      return;
    }

    try {
      await dashboardService.createActivity({
        ...newActivity,
        fecha: new Date().toISOString().split('T')[0]
      });
      showToast('Tarea estratégica asignada exitosamente', 'success');
      setShowAssignForm(false);
      setNewActivity({
        titulo: '',
        problematica: '',
        lineaAccion: '',
        propuestaMeta: '',
        responsables: '',
        descripcion: '',
        oficialId: officers.length > 0 ? officers[0].id.toString() : '2',
        oficialNombre: officers.length > 0 ? officers[0].nombre : 'Juan Vargas',
        zona: 'Barranca',
        status: 'Pendiente'
      });
      loadData();
    } catch (error) {
      showToast('Error al asignar la tarea', 'error');
    }
  };

  // Extraer oficiales únicos
  const officerList = ['Todos los oficiales', ...new Set(activities.map(a => a.officer))];

  // Filtrar actividades
  const filteredActivities = selectedOfficer === 'Todos los oficiales' 
    ? activities 
    : activities.filter(a => a.officer === selectedOfficer);

  if (loading) return <div style={{ padding: '3rem', color: '#7a9cc4' }}>Cargando actividad operativa...</div>;

  return (
    <div className="actividad-oficiales">
      <header className="actividad-oficiales__header">
        <div className="actividad-oficiales__title-block">
          <h1>Resumen de Actividad</h1>
          <p>Monitoreo en tiempo real de las actualizaciones del personal en campo</p>
        </div>
        <button 
          className="btn-primary-assign" 
          onClick={() => setShowAssignForm(true)}
        >
          Asignar Acción Estratégica
        </button>
      </header>

      {showAssignForm && (
        <div className="assign-modal-overlay">
          <div className="assign-modal" style={{ maxWidth: '600px' }}>
            <h3>Asignar Tarea Operativa</h3>
            <form onSubmit={handleCreateActivity}>
              <div className="form-row-grid">
                <div className="form-group">
                  <label>Título / Problemática *</label>
                  <input 
                    type="text" 
                    placeholder="Ej: Consumo de licor en vía pública" 
                    value={newActivity.titulo}
                    onChange={e => setNewActivity({...newActivity, titulo: e.target.value, problematica: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Línea de Acción *</label>
                  <input 
                    type="text" 
                    placeholder="Ej: LA-2025-001" 
                    value={newActivity.lineaAccion}
                    onChange={e => setNewActivity({...newActivity, lineaAccion: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row-grid">
                <div className="form-group">
                  <label>Oficial Responsable</label>
                    <select 
                      value={newActivity.oficialId}
                      onChange={e => {
                        const opt = e.target.options[e.target.selectedIndex];
                        setNewActivity({...newActivity, oficialId: e.target.value, oficialNombre: opt.text});
                      }}
                    >
                      {officers.length > 0 ? (
                        officers.map(off => (
                          <option key={off.id} value={off.id}>{off.nombre}</option>
                        ))
                      ) : (
                        <option value="">Cargando oficiales...</option>
                      )}
                    </select>
                </div>
                <div className="form-group">
                  <label>Otros Responsables</label>
                  <input 
                    type="text" 
                    placeholder="Ej: Fuerza Pública, Municipalidad" 
                    value={newActivity.responsables}
                    onChange={e => setNewActivity({...newActivity, responsables: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Propuesta / Meta</label>
                <input 
                  type="text" 
                  placeholder="Ej: Reducir reportes en un 20%" 
                  value={newActivity.propuestaMeta}
                  onChange={e => setNewActivity({...newActivity, propuestaMeta: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Descripción Adicional</label>
                <textarea 
                  placeholder="Instrucciones específicas..."
                  value={newActivity.descripcion}
                  onChange={e => setNewActivity({...newActivity, descripcion: e.target.value})}
                ></textarea>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowAssignForm(false)} className="btn-cancel">Cancelar</button>
                <button type="submit" className="btn-assign-submit">Confirmar Asignación</button>
              </div>
            </form>
          </div>
        </div>
      )}


      <section className="actividad-oficiales__stats">
        <div className="actividad-stat actividad-stat--green">
          <div className="actividad-stat__icon"><Users size={24} /></div>
          <div className="actividad-stat__info">
            <span className="actividad-stat__value">{officers.length.toString().padStart(2, '0')}</span>
            <span className="actividad-stat__label">Oficiales registrados</span>
          </div>
        </div>
        <div className="actividad-stat actividad-stat--blue">
          <div className="actividad-stat__icon"><Edit size={24} /></div>
          <div className="actividad-stat__info">
            <span className="actividad-stat__value">{activities.length.toString().padStart(2, '0')}</span>
            <span className="actividad-stat__label">Tareas estratégicas</span>
          </div>
        </div>
        <div className="actividad-stat actividad-stat--orange">
          <div className="actividad-stat__icon"><Clock size={24} /></div>
          <div className="actividad-stat__info">
            <span className="actividad-stat__value">02</span>
            <span className="actividad-stat__label">Sin actividad 7d</span>
          </div>
        </div>
      </section>

      <section className="actividad-history">
        <div className="actividad-history__header">
          <h2 className="actividad-history__title">Historial completo de actualizaciones</h2>
          <div className="actividad-history__filter-container">
            <div 
              className="actividad-history__filter" 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {selectedOfficer} ▾
            </div>
            {isDropdownOpen && (
              <div className="actividad-dropdown">
                {officerList.map(off => (
                  <div 
                    key={off} 
                    className={`actividad-dropdown__item ${selectedOfficer === off ? 'actividad-dropdown__item--active' : ''}`}
                    onClick={() => {
                      setSelectedOfficer(off);
                      setIsDropdownOpen(false);
                      showToast(`Filtrando actividad por: ${off}`, 'info');
                    }}

                  >
                    {off}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="actividad-timeline">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((act) => (
              <div key={act.id} className="actividad-item">
                <div className="actividad-item__indicator" style={{ backgroundColor: act.color, color: act.color }} />
                <div className="actividad-item__line" />
                <div className="actividad-item__content">
                  <div className="actividad-item__meta">
                    <strong>{act.date}</strong> · {act.officer} · {act.zone}
                  </div>
                  <div className="actividad-item__card">
                    <div className="actividad-item__card-header">
                      <div className="actividad-item__main-info">
                        <h4>{act.action} · {act.title}</h4>
                      </div>
                      <span className={`badge badge--${act.statusClass}`}>{act.status}</span>
                    </div>
                    <p className="actividad-item__desc">{act.desc}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#7a9cc4' }}>
              No hay actividades registradas para este oficial.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ActividadOficiales;
