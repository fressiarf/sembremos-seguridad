import React, { useState, useEffect, useRef } from 'react';
import './Calendario.css';
import { ChevronLeft, ChevronRight, Clock, Tag, Bell, BellRing, Trash2, CalendarCheck, X, Edit2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const Calendario = () => {
    const { showToast } = useToast();
    const [fechaActual, setFechaActual] = useState(new Date());
    
    // Cargar eventos desde localStorage
    const [eventos, setEventos] = useState(() => {
        const guardados = localStorage.getItem('sembremos_seguridad_eventos');
        return guardados ? JSON.parse(guardados) : [];
    });

    const [mostrarModal, setMostrarModal] = useState(false);
    const [diaSeleccionado, setDiaSeleccionado] = useState(null);
    const [nuevoEvento, setNuevoEvento] = useState({ titulo: '', inicio: '', fin: '', categoria: 'Operativos' });
    const [editandoId, setEditandoId] = useState(null);
    const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
    const notificadosRef = useRef(new Set());

    // Persistir eventos en localStorage
    useEffect(() => {
        localStorage.setItem('sembremos_seguridad_eventos', JSON.stringify(eventos));
    }, [eventos]);

    const [alertaInminente, setAlertaInminente] = useState(null);

    // Solicitar permiso para notificaciones del navegador
    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    // ── Motor de notificaciones REFINADO ──
    useEffect(() => {
        const ETAPAS_DIAS = [7, 5, 3, 1];
        const ETAPAS_MINS = [60, 30, 15, 5];

        const verificarEventosProximos = () => {
            const ahora = new Date();
            
            let eventoMasUrgente = null;
            let menorDiffMin = Infinity;

            eventos.forEach(ev => {
                const [anioEv, mesEv, diaEv] = ev.fecha.split('-').map(Number);
                const [horasEv, minsEv] = ev.inicio.split(':').map(Number);
                const fechaHoraEvento = new Date(anioEv, mesEv - 1, diaEv, horasEv, minsEv);
                
                const diffMs = fechaHoraEvento - ahora;
                const diffMinTotal = Math.floor(diffMs / 60000);
                const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

                // Si el evento ya pasó hace más de 1 hora, no procesar
                if (diffMinTotal < -60) return;

                // 1. Anticlumping: Si vemos el evento por primera vez, marcar etapas pasadas como ya "notificadas"
                const eventSeenKey = `seen-${ev.id}`;
                if (!notificadosRef.current.has(eventSeenKey)) {
                    notificadosRef.current.add(eventSeenKey);
                    
                    // Solo marcar como "vistas" las etapas que YA pasaron (estrictamente mayores)
                    // Las etapas menores o iguales (la actual y futuras) se dejan libres para sonar.
                    ETAPAS_DIAS.forEach(d => { if (diffDias < d) notificadosRef.current.add(`${ev.id}-d${d}`); });
                    
                    // Para minutos, si ya estamos dentro de un rango (ej: 12 min), 
                    // queremos que suene la etapa de 15, pero no las de 60 o 30.
                    ETAPAS_MINS.forEach(m => { if (diffMinTotal < m - 5) notificadosRef.current.add(`${ev.id}-m${m}`); });
                }

                // 2. Procesar Etapas por Días
                ETAPAS_DIAS.forEach(d => {
                    const clave = `${ev.id}-d${d}`;
                    if (diffDias <= d && !notificadosRef.current.has(clave)) {
                        notificadosRef.current.add(clave);
                        showToast(`📅 Evento en ${diffDias} ${diffDias === 1 ? 'día' : 'días'}: "${ev.titulo}"`, 'info');
                    }
                });

                // 3. Procesar Etapas por Minutos (Hoy)
                const hoyStr = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}-${String(ahora.getDate()).padStart(2, '0')}`;
                if (ev.fecha === hoyStr && diffMinTotal > 0) {
                    ETAPAS_MINS.forEach(m => {
                        const clave = `${ev.id}-m${m}`;
                        if (diffMinTotal <= m && !notificadosRef.current.has(clave)) {
                            notificadosRef.current.add(clave);
                            const esCritico = m <= 5;
                            const icono = esCritico ? '🚨' : '⏰';
                            
                            showToast(`${icono} "${ev.titulo}" inicia en ${diffMinTotal} min`, esCritico ? 'error' : 'info');
                            
                            if (Notification.permission === 'granted') {
                                new Notification(`${icono} Evento próximo - Sembremos Seguridad`, {
                                    body: `"${ev.titulo}" inicia en ${diffMinTotal} min (${ev.inicio})`,
                                    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
                                    tag: clave,
                                    requireInteraction: esCritico
                                });
                            }
                        }
                    });

                    // Banner persistente (solo si falta ≤ 15 min)
                    if (diffMinTotal <= 15 && diffMinTotal < menorDiffMin) {
                        menorDiffMin = diffMinTotal;
                        eventoMasUrgente = { ...ev, minutosRestantes: diffMinTotal };
                    }
                }
            });

            setAlertaInminente(eventoMasUrgente);
        };

        verificarEventosProximos();
        const intervalo = setInterval(verificarEventosProximos, 15000);
        return () => clearInterval(intervalo);
    }, [eventos, showToast]);


    // Lógica de fechas
    const mes = fechaActual.getMonth();
    const anio = fechaActual.getFullYear();

    const nombresMeses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const diasSemana = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

    const primerDiaMes = new Date(anio, mes, 1).getDay();
    const primerDiaAjustado = primerDiaMes === 0 ? 6 : primerDiaMes - 1;
    const diasEnMes = new Date(anio, mes + 1, 0).getDate();

    const diasMesAnterior = new Date(anio, mes, 0).getDate();
    const rellenoAnterior = Array.from({ length: primerDiaAjustado }, (_, i) => ({
        dia: diasMesAnterior - primerDiaAjustado + i + 1,
        fueraMes: true
    }));

    const diasMesActual = Array.from({ length: diasEnMes }, (_, i) => ({
        dia: i + 1,
        fueraMes: false
    }));

    const rellenoPosterior = Array.from({ length: 42 - (rellenoAnterior.length + diasMesActual.length) }, (_, i) => ({
        dia: i + 1,
        fueraMes: true
    }));

    const todosLosDias = [...rellenoAnterior, ...diasMesActual, ...rellenoPosterior];

    const cambiarMes = (offset) => {
        setFechaActual(new Date(anio, mes + offset, 1));
    };

    const abrirModal = (dia, fueraMes, evento = null) => {
        if (fueraMes && !evento) return;
        
        if (evento) {
            setNuevoEvento({
                titulo: evento.titulo,
                inicio: evento.inicio,
                fin: evento.fin,
                categoria: evento.categoria
            });
            setEditandoId(evento.id);
            setDiaSeleccionado(evento.fecha);
        } else {
            const fechaString = `${anio}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
            
            // Validar que no sea una fecha pasada para agendar
            const ahora = new Date();
            const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
            const [y, m, d] = fechaString.split('-').map(Number);
            const fechaSel = new Date(y, m - 1, d);

            if (fechaSel < hoy) {
                showToast('No se pueden agendar eventos en fechas pasadas', 'warning');
                return;
            }

            setDiaSeleccionado(fechaString);
            setNuevoEvento({ titulo: '', inicio: '', fin: '', categoria: 'Operativos' });
            setEditandoId(null);
        }
        setMostrarModal(true);
    };

    const cerrarModal = () => {
        setMostrarModal(false);
        setNuevoEvento({ titulo: '', inicio: '', fin: '', categoria: 'Operativos' });
        setEditandoId(null);
    };

    const guardarEvento = (e) => {
        e.preventDefault();
        if (!nuevoEvento.titulo || !nuevoEvento.inicio || !nuevoEvento.fin) return;
        
        // Validar duración máxima de 60 minutos
        const [hIni, mIni] = nuevoEvento.inicio.split(':').map(Number);
        const [hFin, mFin] = nuevoEvento.fin.split(':').map(Number);
        const totalMinsIni = hIni * 60 + mIni;
        const totalMinsFin = hFin * 60 + mFin;
        const duracion = totalMinsFin - totalMinsIni;

        if (duracion < 0) {
            showToast('La hora de fin debe ser posterior a la de inicio', 'warning');
            return;
        }

        if (duracion > 60) {
            showToast('⚠️ La duración máxima permitida es de 60 min', 'error');
            return;
        }
        
        if (editandoId) {
            setEventos(prev => prev.map(ev => 
                ev.id === editandoId 
                    ? { ...ev, ...nuevoEvento } 
                    : ev
            ));
            showToast(`Evento "${nuevoEvento.titulo}" actualizado`, 'success');
        } else {
            const eventoFinal = {
                ...nuevoEvento,
                id: Date.now(),
                fecha: diaSeleccionado
            };
            setEventos([...eventos, eventoFinal]);
            showToast(`Evento "${eventoFinal.titulo}" agregado al ${diaSeleccionado}`, 'success');
        }
        
        cerrarModal();
    };

    const eliminarEvento = (id) => {
        setEventos(eventos.filter(e => e.id !== id));
        showToast('Evento eliminado correctamente', 'info');
        if (editandoId === id) cerrarModal();
    };

    const getEventosDia = (dia, fueraMes) => {
        if (fueraMes) return [];
        const fechaString = `${anio}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
        return eventos.filter(e => e.fecha === fechaString);
    };

    const getColorCategoria = (cat) => {
        switch (cat) {
            case 'Operativos': return '#ef4444';
            case 'Reuniones': return '#3b82f6';
            case 'Seguimiento de Matriz': return '#22c55e';
            default: return '#64748b';
        }
    };

    // Eventos de hoy para el panel de notificaciones
    const hoy = new Date();
    const hoyStr = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
    const eventosHoy = eventos.filter(e => e.fecha === hoyStr).sort((a, b) => a.inicio.localeCompare(b.inicio));

    return (
        <div className="calendario-container">
            <div className="calendario-header">
                <div className="calendario-info">
                    <h1>{nombresMeses[mes]} <span>{anio}</span></h1>
                    <p>Gestión cronológica de actividades y tareas interinstitucionales.</p>
                </div>
                <div className="calendario-nav">
                    {/* Botón de notificaciones */}
                    <button 
                        className={`notif-btn ${eventosHoy.length > 0 ? 'notif-btn--active' : ''}`}
                        onClick={() => setMostrarNotificaciones(!mostrarNotificaciones)}
                        title="Ver eventos de hoy"
                    >
                        {eventosHoy.length > 0 ? <BellRing size={20} /> : <Bell size={20} />}
                        {eventosHoy.length > 0 && <span className="notif-badge">{eventosHoy.length}</span>}
                    </button>

                    <button onClick={() => cambiarMes(-1)} className="nav-btn"><ChevronLeft size={20} /></button>
                    <button onClick={() => setFechaActual(new Date())} className="today-btn">Hoy</button>
                    <button onClick={() => cambiarMes(1)} className="nav-btn"><ChevronRight size={20} /></button>
                </div>
            </div>

            {/* ── Banner de Alerta Persistente ── */}
            {alertaInminente && (
                <div className={`alerta-banner ${alertaInminente.minutosRestantes <= 5 ? 'alerta-banner--urgente' : ''}`}
                     onClick={() => abrirModal(null, false, alertaInminente)}
                     style={{ cursor: 'pointer' }}
                     title="Clic para editar"
                >
                    <div className="alerta-banner__icon">
                        {alertaInminente.minutosRestantes <= 5 ? '🚨' : '⏰'}
                    </div>
                    <div className="alerta-banner__content">
                        <strong>{alertaInminente.titulo}</strong>
                        <span>Inicia en <b>{alertaInminente.minutosRestantes} min</b> — {alertaInminente.inicio}</span>
                    </div>
                    <div className="alerta-banner__categoria" style={{ backgroundColor: getColorCategoria(alertaInminente.categoria) }}>
                        {alertaInminente.categoria}
                    </div>
                </div>
            )}

            {/* ── Panel de Notificaciones: Eventos de Hoy ── */}
            {mostrarNotificaciones && (
                <div className="notif-panel">
                    <div className="notif-panel__header">
                        <div className="notif-panel__title">
                            <CalendarCheck size={18} />
                            <span>Agenda del Día</span>
                        </div>
                        <button className="notif-panel__close" onClick={() => setMostrarNotificaciones(false)}>
                            <X size={16} />
                        </button>
                    </div>
                    {eventosHoy.length === 0 ? (
                        <div className="notif-empty">
                            <Bell size={32} />
                            <p>No hay eventos programados para hoy.</p>
                        </div>
                    ) : (
                        <div className="notif-list">
                            {eventosHoy.map(ev => (
                                <div key={ev.id} className="notif-item">
                                    <div className="notif-item__color" style={{ backgroundColor: getColorCategoria(ev.categoria) }} />
                                    <div className="notif-item__info">
                                        <span className="notif-item__title">{ev.titulo}</span>
                                        <span className="notif-item__time">
                                            <Clock size={12} /> {ev.inicio} — {ev.fin}
                                        </span>
                                        <span className="notif-item__cat" style={{ color: getColorCategoria(ev.categoria) }}>{ev.categoria}</span>
                                    </div>
                                    <div className="notif-item__actions">
                                        <button className="notif-item__action notif-item__edit" onClick={() => abrirModal(null, false, ev)} title="Editar evento">
                                            <Edit2 size={14} />
                                        </button>
                                        <button className="notif-item__action notif-item__delete" onClick={() => eliminarEvento(ev.id)} title="Eliminar evento">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="calendario-grid">
                {diasSemana.map(d => (
                    <div key={d} className="grid-weekday">{d}</div>
                ))}
                {todosLosDias.map((item, idx) => {
                    const eventosDia = getEventosDia(item.dia, item.fueraMes);
                    return (
                        <div 
                            key={idx} 
                            className={`grid-day ${item.fueraMes ? 'fuera-mes' : ''}`}
                            onClick={() => abrirModal(item.dia, item.fueraMes)}
                        >
                            <span className="day-number">{item.dia}</span>
                            <div className="day-events">
                                {eventosDia.map(ev => (
                                    <div 
                                        key={ev.id} 
                                        className="event-pill" 
                                        style={{ backgroundColor: getColorCategoria(ev.categoria) }}
                                        title={`${ev.inicio} - ${ev.titulo} (Clic para editar)`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            abrirModal(null, false, ev);
                                        }}
                                    >
                                        <span className="event-time">{ev.inicio}</span>
                                        <span className="event-title">{ev.titulo}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {mostrarModal && (
                <div className="calendar-modal-overlay">
                    <div className="calendar-modal">
                        <div className="modal-header">
                            <h2>{editandoId ? 'Editar Evento' : 'Nuevo Evento'}</h2>
                            <p>Fecha: {diaSeleccionado}</p>
                        </div>
                        <form onSubmit={guardarEvento}>
                            <div className="form-group">
                                <label>Título del Evento</label>
                                <input 
                                    type="text" 
                                    required 
                                    placeholder="Ej: Intervención Comunitaria"
                                    value={nuevoEvento.titulo}
                                    onChange={e => setNuevoEvento({...nuevoEvento, titulo: e.target.value})}
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label><Clock size={14} /> Inicio</label>
                                    <input 
                                        type="time" 
                                        required 
                                        value={nuevoEvento.inicio}
                                        onChange={e => setNuevoEvento({...nuevoEvento, inicio: e.target.value})}
                                    />
                                </div>
                                <div className="form-group">
                                    <label><Clock size={14} /> Fin</label>
                                    <input 
                                        type="time" 
                                        required 
                                        value={nuevoEvento.fin}
                                        onChange={e => setNuevoEvento({...nuevoEvento, fin: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label><Tag size={14} /> Categoría</label>
                                <select 
                                    value={nuevoEvento.categoria}
                                    onChange={e => setNuevoEvento({...nuevoEvento, categoria: e.target.value})}
                                >
                                    <option value="Operativos">Operativos (Rojo)</option>
                                    <option value="Reuniones">Reuniones (Azul)</option>
                                    <option value="Seguimiento de Matriz">Seguimiento de Matriz (Verde)</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={cerrarModal}>Cerrar</button>
                                {editandoId && (
                                    <button 
                                        type="button" 
                                        className="btn-delete" 
                                        onClick={() => eliminarEvento(editandoId)}
                                    >
                                        <Trash2 size={16} /> Eliminar
                                    </button>
                                )}
                                <button type="submit" className="btn-save">
                                    {editandoId ? 'Guardar Cambios' : 'Guardar Evento'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendario;
