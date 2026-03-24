import React, { useState, useEffect } from 'react';
import './NotificacionAdmin.css';
import { Calendar as CalendarIcon, Clock, Bell, AlertCircle, CheckCircle, Settings } from 'lucide-react';

function NotificacionAdmin({ variant = 'fullpage' }) {
    const [eventos, setEventos] = useState([]);
    const [filtroCategoria, setFiltroCategoria] = useState('Todos');

    useEffect(() => {
        const cargarEventos = () => {
            const guardados = localStorage.getItem('sembremos_seguridad_eventos');
            if (guardados) {
                setEventos(JSON.parse(guardados));
            }
        };

        cargarEventos();

        // Escuchar cambios en localStorage o simular actualización
        const interval = setInterval(cargarEventos, 3000);
        return () => clearInterval(interval);
    }, []);

    // Ordenar por fecha y luego por hora
    const eventosOrdenados = [...eventos].sort((a, b) => {
        const fechaA = new Date(`${a.fecha}T${a.inicio}`);
        const fechaB = new Date(`${b.fecha}T${b.inicio}`);
        return fechaA - fechaB;
    });

    const hoy = new Date();
    const hoyStr = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;

    const getColorCategoria = (cat) => {
        switch (cat) {
            case 'Operativos': return '#ef4444';
            case 'Reuniones': return '#3b82f6';
            case 'Seguimiento de Matriz': return '#22c55e';
            default: return '#64748b';
        }
    };

    const getColorFiltro = (cat) => {
        if (cat === 'Todos') return '#475569';
        return getColorCategoria(cat);
    };

    const categorias = ['Todos', 'Operativos', 'Reuniones', 'Seguimiento de Matriz'];

    const eventosFiltrados = eventosOrdenados.filter(ev => 
       filtroCategoria === 'Todos' || ev.categoria === filtroCategoria
    );

    const drawerStyles = variant === 'drawer' ? {} : {};

    return (
        <div className={`admin-notif-container ${variant === 'drawer' ? 'admin-notif-drawer' : 'admin-notif-fullpage'}`} style={drawerStyles}>
            <div className="admin-notif-header">
                <div className="admin-notif-title">
                    <h2>Notificaciones</h2>
                </div>
                <button className="admin-notif-settings-btn" title="Configuración">
                    <Settings size={20} />
                </button>
            </div>

            <div className="admin-notif-filters" style={{ padding: '0.75rem 1rem', display: 'flex', gap: '0.4rem', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', flexWrap: 'wrap' }}>
                {categorias.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFiltroCategoria(cat)}
                        style={{
                            padding: '0.25rem 0.65rem',
                            borderRadius: '999px',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            border: `1px solid ${filtroCategoria === cat ? getColorFiltro(cat) : '#e2e8f0'}`,
                            backgroundColor: filtroCategoria === cat ? `${getColorFiltro(cat)}15` : '#ffffff',
                            color: filtroCategoria === cat ? getColorFiltro(cat) : '#64748b',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: filtroCategoria === cat ? 'none' : '0 1px 2px rgba(0,0,0,0.02)'
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="admin-notif-content">
                {eventosFiltrados.length === 0 ? (
                    <div className="admin-notif-empty">
                        <Bell size={48} className="admin-notif-empty-icon" strokeWidth={1.5} />
                        <h3 className="admin-notif-empty-title">{filtroCategoria === 'Todos' ? 'Aquí encontrarás las notificaciones' : `Sin eventos en ${filtroCategoria}`}</h3>
                        <p className="admin-notif-empty-subtitle">{filtroCategoria === 'Todos' ? 'Los eventos programados y las alertas se mostrarán aquí.' : 'No hay alertas en esta categoría para mostrar.'}</p>
                    </div>
                ) : (
                    <div className="admin-notif-list">
                        {eventosFiltrados.map((ev) => {
                            const esHoy = ev.fecha === hoyStr;
                            return (
                                <div key={ev.id} className={`admin-notif-card ${esHoy ? 'admin-notif-today' : ''}`}>
                                    <div
                                        className="admin-notif-color-bar"
                                        style={{ backgroundColor: getColorCategoria(ev.categoria) }}
                                    />
                                    <div className="admin-notif-info">
                                        <h4 className="admin-notif-event-title">{ev.titulo}</h4>
                                        <div className="admin-notif-details">
                                            <span className="admin-notif-date">
                                                <CalendarIcon size={14} />
                                                {esHoy ? 'Hoy' : ev.fecha}
                                            </span>
                                            <span className="admin-notif-time">
                                                <Clock size={14} />
                                                {ev.inicio} - {ev.fin}
                                            </span>
                                        </div>
                                        <span
                                            className="admin-notif-category"
                                            style={{ color: getColorCategoria(ev.categoria), backgroundColor: `${getColorCategoria(ev.categoria)}22` }}
                                        >
                                            {ev.categoria}
                                        </span>
                                    </div>
                                    {esHoy && (
                                        <AlertCircle size={20} className="admin-notif-alert-icon" color="#ef4444" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default NotificacionAdmin;