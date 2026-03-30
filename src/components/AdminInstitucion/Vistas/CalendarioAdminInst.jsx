import React, { useState, useEffect } from 'react';
import { adminInstitucionService } from '../../../services/adminInstitucionService';
import { useLogin } from '../../../context/LoginContext';
import { useToast } from '../../../context/ToastContext';
import { ChevronLeft, ChevronRight, Activity, MapPin, Users } from 'lucide-react';
import '../AdminInstitucion.css';

const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const CalendarioAdminInst = () => {
  const { user } = useLogin();
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date(2025, 2, 1)); // March 2025 to show mock data
  const [selectedDay, setSelectedDay] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      try {
        const data = await adminInstitucionService.getCalendarioTareas(user.id);
        setTareas(data);
      } catch (e) {
        showToast('Error al cargar calendario', 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Get tasks for a day
  const getTareasForDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tareas.filter(t => t.fecha === dateStr);
  };

  // Get tasks for the entire month
  const getTareasForMonth = () => {
    return tareas.filter(t => {
      const d = new Date(t.fecha);
      return d.getFullYear() === year && d.getMonth() === month;
    });
  };

  const getColorClass = (estado) => {
    if (estado === 'Completado') return '#22c55e';
    if (estado === 'Con Actividades') return '#f59e0b';
    return '#ef4444'; // Sin Actividades
  };

  const hoy = new Date();
  const isVencida = (fechaStr) => new Date(fechaStr) < hoy;

  if (loading) return <div style={{ padding: '3rem', color: '#7a9cc4' }}>Cargando calendario...</div>;

  const monthTareas = getTareasForMonth();
  const selectedTareas = selectedDay ? getTareasForDay(selectedDay) : [];

  return (
    <div style={{ padding: '2rem 2.5rem', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: '0 0 4px', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
          Calendario de Tareas
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', margin: 0, textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
          Vista mensual de las tareas asignadas a tu institución.
        </p>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '1.5rem' }}>
        {[
          { color: '#22c55e', label: 'Completado' },
          { color: '#f59e0b', label: 'Con Actividades' },
          { color: '#ef4444', label: 'Sin Actividades / Vencida' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: item.color }} />
            <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>{item.label}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem' }}>
        {/* Calendar Grid */}
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          {/* Month Navigation */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '16px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0'
          }}>
            <button onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '6px', color: '#64748b' }}>
              <ChevronLeft size={20} />
            </button>
            <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0b2240' }}>
              {MESES[month]} {year}
            </h2>
            <button onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '6px', color: '#64748b' }}>
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Days header */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid #e2e8f0' }}>
            {DIAS.map(d => (
              <div key={d} style={{
                textAlign: 'center', padding: '10px', fontSize: '0.72rem',
                fontWeight: 700, color: '#64748b', textTransform: 'uppercase'
              }}>
                {d}
              </div>
            ))}
          </div>

          {/* Calendar cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {/* Empty cells for first day offset */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} style={{ padding: '8px', minHeight: '80px', background: '#fafafa', borderRight: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }} />
            ))}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayTareas = getTareasForDay(day);
              const isToday = day === hoy.getDate() && month === hoy.getMonth() && year === hoy.getFullYear();
              const isSelected = day === selectedDay;

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  style={{
                    padding: '6px 8px',
                    minHeight: '80px',
                    borderRight: '1px solid #f1f5f9',
                    borderBottom: '1px solid #f1f5f9',
                    cursor: 'pointer',
                    background: isSelected ? '#eff6ff' : isToday ? '#f0fdf4' : '#fff',
                    transition: 'background 0.15s',
                  }}
                >
                  <div style={{
                    fontSize: '0.78rem', fontWeight: isToday ? 800 : 600,
                    color: isToday ? '#22c55e' : '#334155',
                    marginBottom: '4px',
                  }}>
                    {day}
                  </div>
                  {dayTareas.map(t => (
                    <div key={t.id} style={{
                      fontSize: '0.65rem',
                      padding: '2px 4px',
                      marginBottom: '2px',
                      borderRadius: '3px',
                      background: isVencida(t.fecha) && t.estado !== 'Completado' ? '#fef2f2' : getColorClass(t.estado) + '20',
                      borderLeft: `3px solid ${isVencida(t.fecha) && t.estado !== 'Completado' ? '#ef4444' : getColorClass(t.estado)}`,
                      color: '#334155',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {t.titulo.length > 18 ? t.titulo.substring(0, 18) + '…' : t.titulo}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar: Selected Day Details or Month Summary */}
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', alignSelf: 'flex-start' }}>
          {selectedDay && selectedTareas.length > 0 ? (
            <>
              <h3 style={{ margin: '0 0 12px', fontSize: '1rem', fontWeight: 700, color: '#0b2240' }}>
                {selectedDay} de {MESES[month]}
              </h3>
              {selectedTareas.map(t => (
                <div key={t.id} style={{
                  padding: '10px 12px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  marginBottom: '8px',
                }}>
                  <div style={{ fontWeight: 700, color: '#0b2240', fontSize: '0.85rem', marginBottom: '6px' }}>{t.titulo}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.75rem', color: '#64748b' }}>
                    <span><Activity size={11} style={{ verticalAlign: 'middle' }} /> L#{t.lineaNumero} — {t.lineaNombre}</span>
                    <span><MapPin size={11} style={{ verticalAlign: 'middle' }} /> {t.zona}</span>
                    <span><Users size={11} style={{ verticalAlign: 'middle' }} /> {t.responsable?.nombre || 'Sin asignar'}</span>
                  </div>
                  <span className={`admin-inst-badge ${t.estado === 'Completado' ? 'admin-inst-badge--completado' : t.estado === 'Con Actividades' ? 'admin-inst-badge--con-actividades' : 'admin-inst-badge--sin-actividades'}`} style={{ marginTop: '6px' }}>
                    {t.estado}
                  </span>
                </div>
              ))}
            </>
          ) : (
            <>
              <h3 style={{ margin: '0 0 12px', fontSize: '1rem', fontWeight: 700, color: '#0b2240' }}>
                Resumen — {MESES[month]} {year}
              </h3>
              <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <span>Tareas este mes</span>
                  <strong>{monthTareas.length}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#22c55e' }}>Completadas</span>
                  <strong>{monthTareas.filter(t => t.estado === 'Completado').length}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#f59e0b' }}>Con Actividades</span>
                  <strong>{monthTareas.filter(t => t.estado === 'Con Actividades').length}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                  <span style={{ color: '#ef4444' }}>Sin Actividades</span>
                  <strong>{monthTareas.filter(t => t.estado === 'Sin Actividades').length}</strong>
                </div>
              </div>
              {selectedDay && selectedTareas.length === 0 && (
                <div style={{ marginTop: '16px', padding: '16px', background: '#f8fafc', borderRadius: '8px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                  No hay tareas para el {selectedDay} de {MESES[month]}
                </div>
              )}
              <p style={{ marginTop: '16px', fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic' }}>
                Haz clic en un día para ver sus tareas.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarioAdminInst;
