import React, { useState, useEffect } from 'react';
import './NotificacionAdmin.css';
import { Calendar as CalendarIcon, Clock, Bell, AlertCircle, AlertTriangle, CheckCircle, Settings } from 'lucide-react';
import { alertasService } from '../../../services/alertasService';

function NotificacionAdmin({ variant = 'fullpage' }) {
    const [eventos, setEventos] = useState([]);
    const [filtroCategoria, setFiltroCategoria] = useState('Todos');
    const [notificaciones, setNotificaciones] = useState([]);
    const [alertasVencimiento, setAlertasVencimiento] = useState([]);

    useEffect(() => {
        const cargarDatos = async () => {
            // 1. Cargar eventos de localStorage (existente)
            const guardados = localStorage.getItem('sembremos_seguridad_eventos');
            const evs = guardados ? JSON.parse(guardados) : [];
            setEventos(evs);

            // 2. Cargar notificaciones de seguridad del servidor
            try {
                const res = await fetch('http://localhost:5000/notificaciones_admin');
                if (res.ok) {
                    const data = await res.json();
                    setNotificaciones(data);
                }
            } catch (error) {
                console.error('Error fetching server notifications:', error);
            }

            // 3. Generar alertas automáticas de vencimiento
            const alertas = await alertasService.generarAlertasVencimiento();
            setAlertasVencimiento(alertas);
        };

        cargarDatos();
        const interval = setInterval(cargarDatos, 15000);
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
            case 'Seguridad': return '#f59e0b';
            case 'Vencimiento': return '#dc2626';
            default: return '#64748b';
        }
    };

    const getColorFiltro = (cat) => {
        if (cat === 'Todos') return '#475569';
        return getColorCategoria(cat);
    };

    const categorias = ['Todos', 'Vencimiento', 'Operativos', 'Reuniones', 'Seguimiento de Matriz', 'Seguridad'];


    const hoyDate = new Date();
    const hoyStrNormalized = hoyDate.toISOString().split('T')[0];

    const alertsServer = notificaciones.map(n => ({
        id: `srv-${n.id}`,
        titulo: n.mensaje,
        categoria: 'Seguridad',
        fecha: n.timestamp.split('T')[0],
        inicio: n.timestamp.split('T')[1].substring(0, 5),
        isServer: true
    }));

    const alertsVencimiento = alertasVencimiento.map(a => ({
        id: a.id,
        titulo: `${a.titulo}`,
        subtitulo: `${a.institucion} · ${a.zona}`,
        categoria: 'Vencimiento',
        fecha: a.fechaLimite,
        inicio: '00:00',
        urgencia: a.tipo,
        textoUrgencia: a.textoUrgencia,
        diasRestantes: a.diasRestantes,
        isDeadline: true
    }));

    const todosLosEventos = [...eventosOrdenados, ...alertsServer, ...alertsVencimiento];

    const eventosFiltrados = todosLosEventos.filter(ev => 
       filtroCategoria === 'Todos' || ev.categoria === filtroCategoria
    ).sort((a,b) => new Date(b.fecha + 'T' + b.inicio) - new Date(a.fecha + 'T' + a.inicio));

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
                        {eventosFiltrados.map((ev) => (
                            <div key={ev.id} className={`admin-notif-card ${ev.fecha === hoyStrNormalized ? 'admin-notif-today' : ''} ${ev.categoria === 'Seguridad' ? 'security-alert' : ''} ${ev.isDeadline && ev.urgencia === 'vencida' ? 'deadline-overdue' : ''} ${ev.isDeadline && ev.urgencia === 'proxima' ? 'deadline-soon' : ''}`}>
                                <div
                                    className="admin-notif-color-bar"
                                    style={{ backgroundColor: getColorCategoria(ev.categoria) }}
                                />
                                <div className="admin-notif-info">
                                    <div className="admin-notif-top">
                                        <h4 className="admin-notif-event-title">{ev.titulo}</h4>
                                        {ev.categoria === 'Seguridad' && <AlertCircle size={16} color="#f59e0b" />}
                                        {ev.isDeadline && ev.urgencia === 'vencida' && <AlertTriangle size={16} color="#dc2626" />}
                                        {ev.isDeadline && ev.urgencia === 'proxima' && <Clock size={16} color="#f59e0b" />}
                                    </div>
                                    {ev.subtitulo && (
                                        <p style={{ margin: '2px 0 6px', fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>{ev.subtitulo}</p>
                                    )}
                                    <div className="admin-notif-details">
                                        <span className="admin-notif-date">
                                            <CalendarIcon size={12} />
                                            {ev.fecha === hoyStrNormalized ? 'Hoy' : ev.fecha}
                                        </span>
                                        {ev.isDeadline ? (
                                            <span className={`admin-notif-urgency ${ev.urgencia}`}>
                                                {ev.textoUrgencia}
                                            </span>
                                        ) : (
                                            <span className="admin-notif-time">
                                                <Clock size={12} />
                                                {ev.inicio}
                                            </span>
                                        )}
                                    </div>
                                    <span
                                        className="admin-notif-category"
                                        style={{ 
                                            color: getColorCategoria(ev.categoria), 
                                            backgroundColor: `${getColorCategoria(ev.categoria)}15`,
                                            border: `1px solid ${getColorCategoria(ev.categoria)}40`
                                        }}
                                    >
                                        {ev.categoria}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default NotificacionAdmin;