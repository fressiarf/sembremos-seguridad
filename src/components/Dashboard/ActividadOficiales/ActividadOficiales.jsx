import React from 'react';
import './ActividadOficiales.css';

const Icon = {
  Users: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Edit: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  Clock: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
};

const ActividadOficiales = () => {
  const [selectedOfficer, setSelectedOfficer] = React.useState('Todos los oficiales');
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const activities = [
    {
      id: 1,
      date: 'Hoy 10:32',
      officer: 'Of. J. Rodríguez',
      zone: 'Barranca',
      action: 'LA-2025-07',
      title: 'Liga deportiva juvenil',
      status: 'En ejecución',
      statusClass: 'ejecucion',
      desc: 'Avance a 90%. Taller completado, 45 jóvenes. Próxima sesión: 22 mar.',
      color: '#22c55e'
    },
    {
      id: 2,
      date: 'Ayer 3:15',
      officer: 'Of. M. Campos',
      zone: 'Chacarita',
      action: 'LA-2025-12',
      title: 'Capacitación anti-droga',
      status: 'Pendiente',
      statusClass: 'pendiente',
      desc: 'Nueva línea registrada. Inicio previsto: 20/03/2025.',
      color: '#3b82f6'
    },
    {
      id: 3,
      date: '13 mar 9:00',
      officer: 'Of. J. Martínez',
      zone: 'Barranca',
      action: 'LA-2025-03',
      title: 'Jornada Plaza Fantasma',
      status: 'Retrasada',
      statusClass: 'retrasada',
      desc: 'Jornada pospuesta por lluvia. Nueva fecha: 25/03/2025.',
      color: '#f59e0b'
    },
    {
      id: 4,
      date: '12 mar 2:40',
      officer: 'Of. A. López',
      zone: 'Cantonal',
      action: 'LA-2025-01',
      title: 'Taller educativo',
      status: 'Completada',
      statusClass: 'completada',
      desc: 'Acción cerrada. 120 beneficiarios. Informe enviado a INL y MSP.',
      color: '#22c55e'
    }
  ];

  // Extraer oficiales únicos
  const officerList = ['Todos los oficiales', ...new Set(activities.map(a => a.officer))];

  // Filtrar actividades
  const filteredActivities = selectedOfficer === 'Todos los oficiales' 
    ? activities 
    : activities.filter(a => a.officer === selectedOfficer);

  return (
    <div className="actividad-oficiales">
      <header className="actividad-oficiales__header">
        <div className="actividad-oficiales__title-block">
          <h1>Actividad de oficiales</h1>
          <p>Historial completo de actualizaciones por oficial</p>
        </div>
        <div className="sidebar-admin__role" style={{ margin: 0 }}>
          <span className="sidebar-admin__role-dot" />
          <span className="sidebar-admin__role-label">Administrador</span>
        </div>
      </header>

      <section className="actividad-oficiales__stats">
        <div className="actividad-stat actividad-stat--green">
          <div className="actividad-stat__icon"><Icon.Users /></div>
          <div className="actividad-stat__info">
            <span className="actividad-stat__value">05</span>
            <span className="actividad-stat__label">Oficiales activos</span>
          </div>
        </div>
        <div className="actividad-stat actividad-stat--blue">
          <div className="actividad-stat__icon"><Icon.Edit /></div>
          <div className="actividad-stat__info">
            <span className="actividad-stat__value">18</span>
            <span className="actividad-stat__label">Updates esta semana</span>
          </div>
        </div>
        <div className="actividad-stat actividad-stat--orange">
          <div className="actividad-stat__icon"><Icon.Clock /></div>
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
