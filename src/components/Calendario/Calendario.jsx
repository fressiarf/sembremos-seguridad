import React, { useState, useEffect, useRef } from 'react';
import './Calendario.css';
import { ChevronLeft, ChevronRight, Clock, Tag, Trash2, Users, Search } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useLogin } from '../../context/LoginContext';
import { dashboardService } from '../../services/dashboardService';
import emailjs from '@emailjs/browser';

const CATEGORIAS = {
    'Operativos': '#ef4444',
    'Reuniones': '#3b82f6',
    'Seguimiento de Matriz': '#22c55e'
};

const INSTITUCIONES = [
    'PANI', 'IMAS', 'CCSS', 'MEP', 'IAFA',
    'Ministerio de Salud', 'Bomberos', 'Cruz Roja',
    'Municipalidad de Puntarenas', 'Fuerza Pública', 'INL'
];

const Calendario = () => {
    const { showToast } = useToast();
    const { user } = useLogin();

    const [fechaActual, setFechaActual] = useState(new Date());
    const [originalEventos, setOriginalEventos] = useState([]); // Todos los del servidor
    const [eventos, setEventos] = useState([]); // Filtrados para el usuario actual
    const [loading, setLoading] = useState(true);
    
    const [mostrarModal, setMostrarModal] = useState(false);
    const [diaSeleccionado, setDiaSeleccionado] = useState(null);
    const [nuevoEvento, setNuevoEvento] = useState({ 
        titulo: '', 
        inicio: '', 
        fin: '', 
        categoria: 'Operativos',
        participantes: [] 
    });
    const [editandoId, setEditandoId] = useState(null);
    const notificadosRef = useRef(new Set());
    const [alertaInminente, setAlertaInminente] = useState(null);

    // ── EmailJS Init ──
    useEffect(() => {
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
        if (publicKey) emailjs.init(publicKey);
    }, []);

    // ── Cargar Eventos desde el Servidor ──
    const loadEventos = async () => {
        setLoading(true);
        try {
            const data = await dashboardService.getEventos();
            setOriginalEventos(data || []);
        } catch (error) {
            showToast('Error al conectar con el servidor', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadEventos(); }, []);

    // ── Filtrado según ROL y Participación ──
    useEffect(() => {
        if (!user) return;
        
        let filtrados = [];
        if (user.rol === 'admin') {
            // Admin Global ve TODO
            filtrados = originalEventos;
        } else {
            // Admin Institución, Editor, Institución:
            // Solo ven si:
            // 1. Son los creadores
            // 2. Su institución es la creadora
            // 3. Su institución está en los participantes
            filtrados = originalEventos.filter(ev => {
                const esCreador = String(ev.creadorId) === String(user.id);
                const esDeSuInstitucion = ev.institucion === user.institucion;
                const estaInvolucrado = ev.participantes?.includes(user.institucion);
                return esCreador || esDeSuInstitucion || estaInvolucrado;
            });
        }
        setEventos(filtrados);
    }, [originalEventos, user]);

    // Solicitar permiso notificaciones
    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    // ── Motor de notificaciones ──
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

                if (diffMinTotal < -60) return;

                const eventSeenKey = `seen-${ev.id}`;
                if (!notificadosRef.current.has(eventSeenKey)) {
                    notificadosRef.current.add(eventSeenKey);
                    ETAPAS_DIAS.forEach(d => { if (diffDias < d) notificadosRef.current.add(`${ev.id}-d${d}`); });
                    ETAPAS_MINS.forEach(m => { if (diffMinTotal < m - 5) notificadosRef.current.add(`${ev.id}-m${m}`); });
                }

                ETAPAS_DIAS.forEach(d => {
                    const clave = `${ev.id}-d${d}`;
                    if (diffDias <= d && !notificadosRef.current.has(clave)) {
                        notificadosRef.current.add(clave);
                        showToast(`📅 Evento en ${diffDias} ${diffDias === 1 ? 'día' : 'días'}: "${ev.titulo}"`, 'info');
                    }
                });

                const hoyStr = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}-${String(ahora.getDate()).padStart(2, '0')}`;
                if (ev.fecha === hoyStr && diffMinTotal > 0) {
                    ETAPAS_MINS.forEach(m => {
                        const clave = `${ev.id}-m${m}`;
                        if (diffMinTotal <= m && !notificadosRef.current.has(clave)) {
                            notificadosRef.current.add(clave);
                            const esCritico = m <= 5;
                            showToast(`${esCritico ? '🚨' : '⏰'} "${ev.titulo}" inicia en ${diffMinTotal} min`, esCritico ? 'error' : 'info');
                        }
                    });

                    if (diffMinTotal <= 15 && diffMinTotal < menorDiffMin) {
                        menorDiffMin = diffMinTotal;
                        eventoMasUrgente = { ...ev, minutosRestantes: diffMinTotal };
                    }
                }
            });
            setAlertaInminente(eventoMasUrgente);
        };

        verificarEventosProximos();
        const intervalo = setInterval(verificarEventosProximos, 30000);
        return () => clearInterval(intervalo);
    }, [eventos, showToast]);

    // Lógica calendario
    const mes = fechaActual.getMonth();
    const anio = fechaActual.getFullYear();
    const nombresMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const diasSemana = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

    const primerDiaMes = new Date(anio, mes, 1).getDay();
    const primerDiaAjustado = primerDiaMes === 0 ? 6 : primerDiaMes - 1;
    const diasEnMes = new Date(anio, mes + 1, 0).getDate();
    const diasMesAnterior = new Date(anio, mes, 0).getDate();

    const rellenoAnterior = Array.from({ length: primerDiaAjustado }, (_, i) => ({ dia: diasMesAnterior - primerDiaAjustado + i + 1, fueraMes: true }));
    const diasMesActual = Array.from({ length: diasEnMes }, (_, i) => ({ dia: i + 1, fueraMes: false }));
    const rellenoPosterior = Array.from({ length: 42 - (rellenoAnterior.length + diasMesActual.length) }, (_, i) => ({ dia: i + 1, fueraMes: true }));
    const todosLosDias = [...rellenoAnterior, ...diasMesActual, ...rellenoPosterior];

    const cambiarMes = (offset) => setFechaActual(new Date(anio, mes + offset, 1));

    const abrirModal = (dia, fueraMes, evento = null) => {
        if (fueraMes && !evento) return;
        
        if (evento) {
            setNuevoEvento({
                titulo: evento.titulo,
                inicio: evento.inicio,
                fin: evento.fin,
                categoria: evento.categoria,
                participantes: evento.participantes || []
            });
            setEditandoId(evento.id);
            setDiaSeleccionado(evento.fecha);
        } else {
            const hoy = new Date();
            hoy.setHours(0,0,0,0);
            const fechaString = `${anio}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
            const [y, m, d] = fechaString.split('-').map(Number);
            if (new Date(y, m-1, d) < hoy) {
                showToast('No se pueden agendar eventos pasado el tiempo', 'warning');
                return;
            }
            setDiaSeleccionado(fechaString);
            setNuevoEvento({ titulo: '', inicio: '', fin: '', categoria: 'Operativos', participantes: [user?.institucion].filter(Boolean) });
            setEditandoId(null);
        }
        setMostrarModal(true);
    };

    const cerrarModal = () => {
        setMostrarModal(false);
        setNuevoEvento({ titulo: '', inicio: '', fin: '', categoria: 'Operativos', participantes: [] });
        setEditandoId(null);
    };

    const guardarEvento = async (e) => {
        e.preventDefault();
        const duration = (h1, m1, h2, m2) => (h2*60+m2) - (h1*60+m1);
        const [h1, m1] = nuevoEvento.inicio.split(':').map(Number);
        const [h2, m2] = nuevoEvento.fin.split(':').map(Number);
        
        if (duration(h1, m1, h2, m2) <= 0) {
            showToast('Intervalo de tiempo inválido', 'error');
            return;
        }

        try {
            const dataToSave = {
                ...nuevoEvento,
                fecha: diaSeleccionado,
                creadorId: user.id,
                creadorNombre: user.nombre,
                institucion: user.institucion,
                actualizadoEn: new Date().toISOString()
            };

            if (editandoId) {
                // UPDATE (Simulado con POST/DELETE en json-server si no hay patch mapeado o simplemente recreate)
                // Por ahora asumimos que dashboardService.createEvento maneja el re-guardado si le pasamos ID
                // En un json-server real usaríamos PATCH. Agreguemos PATCH a dashboardService después.
                showToast('Funcionalidad de edición persistente en desarrollo', 'info');
                // TODO: Implement DASHBOARDSERVICE.PATCH
            } else {
                await dashboardService.createEvento(dataToSave);
                showToast(`Evento "${nuevoEvento.titulo}" guardado exitosamente`, 'success');
            }
            loadEventos();
            cerrarModal();
        } catch (error) {
            showToast('Error al guardar el evento', 'error');
        }
    };

    const eliminarEvento = async (id) => {
        try {
            await dashboardService.deleteEvento(id);
            showToast('Evento eliminado', 'info');
            loadEventos();
            cerrarModal();
        } catch (error) {
            showToast('Error al eliminar', 'error');
        }
    };

    const handleToggleParticipante = (inst) => {
        setNuevoEvento(prev => ({
            ...prev,
            participantes: prev.participantes.includes(inst)
                ? prev.participantes.filter(p => p !== inst)
                : [...prev.participantes, inst]
        }));
    };

    if (loading && originalEventos.length === 0) return <div className="calendario-loading">Sincronizando calendario interinstitucional...</div>;

    return (
        <div className="calendario-container">
            <div className="calendario-header">
                <div className="calendario-info">
                    <h1>{nombresMeses[mes]} <span>{anio}</span></h1>
                    <p>Calendario unificado Sembremos Seguridad — {user?.rol?.toUpperCase()}</p>
                </div>
                <div className="calendario-nav">
                    <button onClick={() => cambiarMes(-1)} className="nav-btn"><ChevronLeft size={20} /></button>
                    <button onClick={() => setFechaActual(new Date())} className="today-btn">Hoy</button>
                    <button onClick={() => cambiarMes(1)} className="nav-btn"><ChevronRight size={20} /></button>
                </div>
            </div>

            <div className="calendario-grid">
                {diasSemana.map(d => <div key={d} className="grid-weekday">{d}</div>)}
                {todosLosDias.map((item, idx) => {
                    const str = `${anio}-${String(mes + 1).padStart(2, '0')}-${String(item.dia).padStart(2, '0')}`;
                    const eventosDia = item.fueraMes ? [] : eventos.filter(e => e.fecha === str);
                    const esHoy = !item.fueraMes && new Date().toDateString() === new Date(anio, mes, item.dia).toDateString();

                    return (
                        <div key={idx} className={`grid-day ${item.fueraMes ? 'fuera-mes' : ''} ${esHoy ? 'es-hoy' : ''}`} onClick={() => abrirModal(item.dia, item.fueraMes)}>
                            <span className="day-number">{item.dia}</span>
                            <div className="day-events">
                                {eventosDia.map(ev => (
                                    <div key={ev.id} className="event-pill" style={{ backgroundColor: CATEGORIAS[ev.categoria] }} onClick={(e) => { e.stopPropagation(); abrirModal(null, false, ev); }}>
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
                            <h2>{editandoId ? 'Detalles del Evento' : 'Nueva Actividad'}</h2>
                            <p>Asignado para: {diaSeleccionado}</p>
                        </div>
                        <form onSubmit={guardarEvento}>
                            <div className="form-row">
                                <div className="form-group" style={{ flex: 2 }}>
                                    <label>Descripción de la Actividad</label>
                                    <input type="text" required value={nuevoEvento.titulo} onChange={e => setNuevoEvento({...nuevoEvento, titulo: e.target.value})} placeholder="Ej: Operativo en Barra del Colorado" />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Categoría</label>
                                    <select value={nuevoEvento.categoria} onChange={e => setNuevoEvento({...nuevoEvento, categoria: e.target.value})}>
                                        {Object.keys(CATEGORIAS).map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group"><label>Inicio</label><input type="time" required value={nuevoEvento.inicio} onChange={e => setNuevoEvento({...nuevoEvento, inicio: e.target.value})} /></div>
                                <div className="form-group"><label>Fin</label><input type="time" required value={nuevoEvento.fin} onChange={e => setNuevoEvento({...nuevoEvento, fin: e.target.value})} /></div>
                                <div className="form-group" style={{ flex: 2 }}>
                                    <label>Fecha Seleccionada</label>
                                    <input type="text" disabled value={diaSeleccionado} style={{ background: '#f8fafc', color: '#64748b' }} />
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label><Users size={14} /> Instituciones Involucradas</label>
                                <div className="participantes-grid">
                                    {INSTITUCIONES.map(inst => (
                                        <button key={inst} type="button" 
                                            className={`participante-btn ${nuevoEvento.participantes.includes(inst) ? 'active' : ''}`}
                                            onClick={() => handleToggleParticipante(inst)}>
                                            {inst}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={cerrarModal}>Cerrar</button>
                                {editandoId && <button type="button" className="btn-delete" onClick={() => eliminarEvento(editandoId)}><Trash2 size={16} /> Eliminar</button>}
                                <button type="submit" className="btn-save">{editandoId ? 'Actualizar' : 'Guardar en Agenda'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendario;
