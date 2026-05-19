import React, { useEffect, useState, useCallback } from 'react';
import { Bell, RefreshCw, Calendar, ChevronRight } from 'lucide-react';
import { recordatorioService, formatearAvisoTiempo, cuentaRegresiva } from '../../../services/recordatorioService';
import './MisRecordatorios.css';

/**
 * Widget que muestra los recordatorios próximos del usuario actual.
 * Se alimenta de GET /api/v1/muni/recordatorios/proximos.
 *
 * Props:
 *  - onAbrirCalendario(eventoId): callback al hacer clic en un recordatorio.
 *  - max: cantidad máxima a mostrar (default 5).
 */
const MisRecordatorios = ({ onAbrirCalendario, max = 5 }) => {
  const [recordatorios, setRecordatorios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [, fuerzaRender] = useState(0); // tick para actualizar cuenta regresiva

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await recordatorioService.getProximos(max);
      setRecordatorios(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || 'No se pudieron cargar los recordatorios');
    } finally {
      setCargando(false);
    }
  }, [max]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // Re-render cada 30s para refrescar la cuenta regresiva sin re-fetch.
  useEffect(() => {
    const id = setInterval(() => fuerzaRender((x) => x + 1), 30000);
    return () => clearInterval(id);
  }, []);

  const formatearFecha = (iso) => {
    try {
      return new Date(iso).toLocaleString('es-CR', {
        weekday: 'short', day: 'numeric', month: 'short',
        hour: '2-digit', minute: '2-digit'
      });
    } catch {
      return iso;
    }
  };

  return (
    <section className="mis-recordatorios">
      <header className="mis-recordatorios__header">
        <div className="mis-recordatorios__title">
          <Bell size={18} />
          <span>Mis recordatorios próximos</span>
        </div>
        <button
          className="mis-recordatorios__refresh"
          onClick={cargar}
          disabled={cargando}
          title="Actualizar"
        >
          <RefreshCw size={16} className={cargando ? 'spin' : ''} />
        </button>
      </header>

      {cargando && recordatorios.length === 0 && (
        <div className="mis-recordatorios__empty">Cargando…</div>
      )}

      {!cargando && error && (
        <div className="mis-recordatorios__error">{error}</div>
      )}

      {!cargando && !error && recordatorios.length === 0 && (
        <div className="mis-recordatorios__empty">
          <Calendar size={28} />
          <p>No tienes recordatorios próximos.</p>
          <small>Cuando agendes un evento, los avisos se programan solos.</small>
        </div>
      )}

      {recordatorios.length > 0 && (
        <ul className="mis-recordatorios__lista">
          {recordatorios.map((r) => (
            <li
              key={r.id}
              className="mis-recordatorios__item"
              onClick={() => onAbrirCalendario && onAbrirCalendario(r.evento.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') onAbrirCalendario?.(r.evento.id); }}
            >
              <span className="mis-recordatorios__chip">
                {formatearAvisoTiempo(r.offset_minutos)}
              </span>
              <div className="mis-recordatorios__body">
                <div className="mis-recordatorios__evento">{r.evento.titulo}</div>
                <div className="mis-recordatorios__meta">
                  <span>{formatearFecha(r.evento.fecha_inicio)}</span>
                  <span className="mis-recordatorios__cuenta">{cuentaRegresiva(r.evento.fecha_inicio)}</span>
                </div>
              </div>
              {onAbrirCalendario && <ChevronRight size={16} className="mis-recordatorios__chevron" />}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default MisRecordatorios;
